
-- ============================================================
-- MAIKEY BIRTHDAY WEBSITE
-- SUPABASE DATABASE SCHEMA
-- Feedback + Visitor Analytics + Admin Dashboard
-- ============================================================

-- 1. EXTENSIONS
create extension if not exists pgcrypto;


-- ============================================================
-- 2. FEEDBACK TABLE
-- ============================================================

create table if not exists public.feedback (
    id uuid primary key default gen_random_uuid(),

    rating smallint not null
        check (rating between 1 and 5),

    message text not null
        check (char_length(btrim(message)) between 3 and 1000),

    session_id uuid,

    created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
    on public.feedback (created_at desc);

create index if not exists feedback_session_idx
    on public.feedback (session_id, created_at desc);


-- ============================================================
-- 3. ANALYTICS EVENTS TABLE
-- ============================================================

create table if not exists public.analytics_events (
    id bigint generated always as identity primary key,

    session_id uuid not null,

    event_type text not null
        check (
            event_type in (
                'visit',
                'chapter_view',
                'heartbeat',
                'replay'
            )
        ),

    chapter smallint
        check (chapter between 0 and 8),

    path text not null default '/',

    created_at timestamptz not null default now()
);

create index if not exists events_created_at_idx
    on public.analytics_events (created_at desc);

create index if not exists events_session_idx
    on public.analytics_events (session_id, created_at);

create index if not exists events_type_created_idx
    on public.analytics_events (event_type, created_at desc);

create index if not exists events_chapter_view_idx
    on public.analytics_events (chapter, session_id)
    where event_type = 'chapter_view';


-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

alter table public.feedback
    enable row level security;

alter table public.analytics_events
    enable row level security;

-- Remove public and authenticated access.

revoke all privileges
    on table public.feedback
    from anon, authenticated;

revoke all privileges
    on table public.analytics_events
    from anon, authenticated;

-- Allow privileged server-side operations.

grant all privileges
    on table public.feedback
    to service_role;

grant all privileges
    on table public.analytics_events
    to service_role;


-- ============================================================
-- 5. ADMIN DASHBOARD STATISTICS FUNCTION
-- ============================================================

create or replace function public.admin_stats(
    active_seconds int default 60
)
returns jsonb
language sql
stable
set search_path = public
as $$

    with sess as (

        select
            session_id,
            min(created_at) as first_seen,
            max(created_at) as last_seen,

            max(chapter) filter (
                where event_type = 'chapter_view'
            ) as max_chapter

        from public.analytics_events
        group by session_id

    ),

    views as (

        select
            chapter,
            count(*) as views,
            count(distinct session_id) as sessions

        from public.analytics_events

        where event_type = 'chapter_view'

        group by chapter

    ),

    chapters as (

        select
            gs.chapter,
            coalesce(v.views, 0) as views,
            coalesce(v.sessions, 0) as sessions

        from generate_series(0, 8) as gs(chapter)

        left join views v
            on v.chapter = gs.chapter

    ),

    days as (

        select
            current_date - gs.n as day,

            (
                select count(*)

                from public.analytics_events e

                where e.event_type = 'visit'

                and e.created_at >=
                    (current_date - gs.n)::timestamptz

                and e.created_at <
                    (current_date - gs.n + 1)::timestamptz

            ) as visits

        from generate_series(0, 13) as gs(n)

    )

    select jsonb_build_object(

        -- TOTAL VISITS

        'total_visits',

        (
            select count(*)
            from public.analytics_events
            where event_type = 'visit'
        ),


        -- UNIQUE VISITORS / SESSIONS

        'unique_sessions',

        (
            select count(*)
            from sess
        ),


        -- CURRENTLY ACTIVE SESSIONS

        'active_sessions',

        (
            select count(*)
            from sess

            where last_seen >
                now() - make_interval(
                    secs => greatest(active_seconds, 0)
                )
        ),


        -- APPROXIMATE SESSION DURATION

        'avg_duration_seconds',

        (
            select coalesce(
                round(
                    avg(
                        extract(epoch from (last_seen - first_seen))
                    )
                ),
                0
            )

            from sess

            where last_seen > first_seen
        ),


        -- REPLAY COUNT

        'replays',

        (
            select count(*)
            from public.analytics_events
            where event_type = 'replay'
        ),


        -- CHAPTER STATISTICS

        'chapters',

        (
            select jsonb_agg(
                jsonb_build_object(
                    'chapter', chapter,
                    'views', views,
                    'sessions', sessions
                )
                order by chapter
            )

            from chapters
        ),


        -- LAST 14 DAYS VISITS

        'visits_by_day',

        (
            select jsonb_agg(
                jsonb_build_object(
                    'day', day,
                    'visits', visits
                )
                order by day
            )

            from days
        ),


        -- RECENT VISITOR ACTIVITY

        'recent_activity',

        (
            select coalesce(
                jsonb_agg(r),
                '[]'::jsonb
            )

            from (
                select
                    session_id,
                    event_type,
                    chapter,
                    created_at

                from public.analytics_events

                where event_type <> 'heartbeat'

                order by created_at desc

                limit 25

            ) r
        ),


        -- RECENT VISITOR SESSIONS

        'recent_sessions',

        (
            select coalesce(
                jsonb_agg(s),
                '[]'::jsonb
            )

            from (
                select
                    session_id,
                    first_seen,
                    last_seen,
                    max_chapter,

                    round(
                        extract(
                            epoch from (last_seen - first_seen)
                        )
                    ) as duration_seconds,

                    (
                        last_seen >
                        now() - make_interval(
                            secs => greatest(active_seconds, 0)
                        )
                    ) as active

                from sess

                order by last_seen desc

                limit 10

            ) s
        ),


        -- FEEDBACK COUNT

        'feedback_count',

        (
            select count(*)
            from public.feedback
        ),


        -- AVERAGE FEEDBACK RATING

        'feedback_avg',

        (
            select coalesce(
                round(avg(rating)::numeric, 2),
                0
            )

            from public.feedback
        ),


        -- LATEST FEEDBACK MESSAGES

        'latest_feedback',

        (
            select coalesce(
                jsonb_agg(f),
                '[]'::jsonb
            )

            from (
                select
                    id,
                    rating,
                    message,
                    created_at

                from public.feedback

                order by created_at desc

                limit 100

            ) f
        )

    );

$$;


-- ============================================================
-- 6. FUNCTION SECURITY
-- ============================================================

revoke all
    on function public.admin_stats(int)
    from public, anon, authenticated;

grant execute
    on function public.admin_stats(int)
    to service_role;


-- ============================================================
-- DATABASE SETUP COMPLETED
-- ============================================================