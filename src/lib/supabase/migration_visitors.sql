-- ============================================================
-- MIGRATION 001: Visitor names
-- Safe to re-run. Does not delete or alter existing rows.
-- ============================================================

create extension if not exists pgcrypto;

-- 1. VISITORS ------------------------------------------------

create table if not exists public.visitors (
    id uuid primary key default gen_random_uuid(),

    name text not null
        check (char_length(btrim(name)) between 2 and 40),

    created_at timestamptz not null default now(),
    last_seen_at timestamptz not null default now()
);

create index if not exists visitors_created_at_idx
    on public.visitors (created_at desc);

create index if not exists visitors_last_seen_idx
    on public.visitors (last_seen_at desc);

alter table public.visitors enable row level security;

revoke all privileges on table public.visitors from anon, authenticated;
grant all privileges on table public.visitors to service_role;

-- 2. FEEDBACK: idempotency key to prevent duplicates ----------

alter table public.feedback
    add column if not exists request_id uuid;

create unique index if not exists feedback_request_id_uidx
    on public.feedback (request_id)
    where request_id is not null;

-- NOTE: analytics_events.session_id and feedback.session_id now
-- hold the visitors.id value for new rows. No foreign key is added
-- because older rows hold random browser-made IDs.

-- 3. ADMIN STATS (same keys as before, plus names) ------------

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
            e.session_id,
            min(e.created_at) as first_seen,
            max(e.created_at) as last_seen,
            max(e.chapter) filter (
                where e.event_type = 'chapter_view'
            ) as max_chapter,
            count(*) filter (
                where e.event_type = 'visit'
            ) as visits
        from public.analytics_events e
        group by e.session_id
    ),

    views as (
        select
            e.chapter,
            count(*) as views,
            count(distinct e.session_id) as sessions
        from public.analytics_events e
        where e.event_type = 'chapter_view'
        group by e.chapter
    ),

    chapters as (
        select
            gs.chapter,
            coalesce(v.views, 0) as views,
            coalesce(v.sessions, 0) as sessions
        from generate_series(0, 8) as gs(chapter)
        left join views v on v.chapter = gs.chapter
    ),

    days as (
        select
            current_date - gs.n as day,
            (
                select count(*)
                from public.analytics_events e
                where e.event_type = 'visit'
                  and e.created_at >= (current_date - gs.n)::timestamptz
                  and e.created_at <  (current_date - gs.n + 1)::timestamptz
            ) as visits
        from generate_series(0, 13) as gs(n)
    )

    select jsonb_build_object(

        'total_visits',
        (select count(*) from public.analytics_events where event_type = 'visit'),

        'unique_sessions',
        (select count(*) from sess),

        'named_visitors',
        (select count(*) from public.visitors),

        'active_sessions',
        (
            select count(*) from sess
            where last_seen > now() - make_interval(secs => greatest(active_seconds, 0))
        ),

        'avg_duration_seconds',
        (
            select coalesce(
                round(avg(extract(epoch from (last_seen - first_seen)))),
                0
            )
            from sess
            where last_seen > first_seen
        ),

        'replays',
        (select count(*) from public.analytics_events where event_type = 'replay'),

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

        'visits_by_day',
        (
            select jsonb_agg(
                jsonb_build_object('day', day, 'visits', visits)
                order by day
            )
            from days
        ),

        'recent_activity',
        (
            select coalesce(jsonb_agg(r), '[]'::jsonb)
            from (
                select
                    e.session_id,
                    v.name,
                    e.event_type,
                    e.chapter,
                    e.created_at
                from public.analytics_events e
                left join public.visitors v on v.id = e.session_id
                where e.event_type <> 'heartbeat'
                order by e.created_at desc
                limit 25
            ) r
        ),

        'recent_sessions',
        (
            select coalesce(jsonb_agg(s), '[]'::jsonb)
            from (
                select
                    se.session_id,
                    v.name,
                    se.first_seen,
                    se.last_seen,
                    se.max_chapter,
                    round(extract(epoch from (se.last_seen - se.first_seen))) as duration_seconds,
                    (
                        se.last_seen >
                        now() - make_interval(secs => greatest(active_seconds, 0))
                    ) as active
                from sess se
                left join public.visitors v on v.id = se.session_id
                order by se.last_seen desc
                limit 10
            ) s
        ),

        'recent_visitors',
        (
            select coalesce(jsonb_agg(rv), '[]'::jsonb)
            from (
                select
                    v.id,
                    v.name,
                    v.created_at,
                    v.last_seen_at,
                    coalesce(se.visits, 0) as visits,
                    se.max_chapter
                from public.visitors v
                left join sess se on se.session_id = v.id
                order by v.last_seen_at desc
                limit 20
            ) rv
        ),

        'feedback_count',
        (select count(*) from public.feedback),

        'feedback_avg',
        (
            select coalesce(round(avg(rating)::numeric, 2), 0)
            from public.feedback
        ),

        'rating_breakdown',
        (
            select coalesce(jsonb_object_agg(x.rating::text, x.c), '{}'::jsonb)
            from (
                select rating, count(*) as c
                from public.feedback
                group by rating
            ) x
        ),

        'latest_feedback',
        (
            select coalesce(jsonb_agg(f), '[]'::jsonb)
            from (
                select
                    fb.id,
                    v.name,
                    fb.rating,
                    fb.message,
                    fb.created_at
                from public.feedback fb
                left join public.visitors v on v.id = fb.session_id
                order by fb.created_at desc
                limit 100
            ) f
        )

    );

$$;

revoke all on function public.admin_stats(int) from public, anon, authenticated;
grant execute on function public.admin_stats(int) to service_role;

-- ============================================================
-- MIGRATION 001 COMPLETE
-- ============================================================