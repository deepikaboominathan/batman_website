"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Eye,
  Users,
  Radio,
  Clock,
  MessageCircle,
  Star,
  LogOut,
  Lock,
  Info,
  RotateCcw,
} from "lucide-react";

type Stats = {
  total_visits: number;
  unique_sessions: number;
  active_sessions: number;
  avg_duration_seconds: number;
  replays: number;
  chapters: { chapter: number; views: number; sessions: number }[];
  visits_by_day: { day: string; visits: number }[];
  recent_activity: {
    session_id: string;
    event_type: string;
    chapter: number | null;
    created_at: string;
  }[];
  recent_sessions: {
    session_id: string;
    first_seen: string;
    last_seen: string;
    max_chapter: number | null;
    duration_seconds: number;
    active: boolean;
  }[];
  feedback_count: number;
  feedback_avg: number;
  latest_feedback: {
    id: string;
    rating: number;
    message: string;
    created_at: string;
  }[];
};

const CHAPTER_NAMES = [
  "Cinematic intro",
  "Gift & Batman game",
  "Memories",
  "Maikey's chapter",
  "Songs",
  "Birthday cake",
  "Birthday video",
  "Story letter",
  "Final letter",
];

function fmtDuration(total: number): string {
  const s = Math.round(total);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function timeAgo(iso: string, now: number): string {
  const d = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (d < 5) return "just now";
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

const shortId = (id: string) => id.slice(0, 6).toUpperCase();

function chapterLabel(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `Ch ${n + 1} · ${CHAPTER_NAMES[n] ?? "Unknown"}`;
}

function describeEvent(e: Stats["recent_activity"][number]): string {
  if (e.event_type === "visit") return "Opened the website";
  if (e.event_type === "replay") return "Replayed the story";
  if (e.event_type === "chapter_view") return `Viewed ${chapterLabel(e.chapter)}`;
  return e.event_type;
}

/* ---------------- LOGIN ---------------- */

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !password) return;
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.reload();
        return;
      }
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Login failed.");
    } catch {
      setError("Couldn't reach the server.");
    }
    setBusy(false);
  };

  return (
    <div className="ad-login-wrap">
      <form className="ad-card ad-login" onSubmit={submit}>
        <Lock size={28} className="ad-gold" />
        <h1>Batcave Control Room</h1>
        <p>Private area. Enter the admin password.</p>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="ad-input"
          autoFocus
        />
        {error && <p className="ad-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy || !password}>
          {busy ? "CHECKING…" : "ENTER"}
        </button>
      </form>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="ad-card ad-stat">
      <span className="ad-stat-icon">{icon}</span>
      <span className="ad-stat-label">{label}</span>
      <b className="ad-stat-value">{value}</b>
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error("bad response");
      setStats((await res.json()) as Stats);
      setFetchedAt(Date.now());
      setError("");
    } catch {
      setError("Couldn't refresh. Retrying…");
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 5000);
    return () => clearInterval(id);
  }, [load]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    window.location.reload();
  };

  if (!stats) {
    return (
      <div className="ad-wrap">
        <p className="ad-muted">{error || "Loading the Batcave data…"}</p>
      </div>
    );
  }

  const maxViews = Math.max(1, ...stats.chapters.map((c) => c.views));
  const maxSessions = Math.max(1, ...stats.chapters.map((c) => c.sessions));
  const maxDay = Math.max(1, ...stats.visits_by_day.map((d) => d.visits));

  return (
    <div className="ad-wrap">
      <header className="ad-head">
        <div>
          <h1>Batcave Control Room</h1>
          <p className="ad-muted">
            <span className={`ad-dot ${error ? "bad" : ""}`} />
            {error || `Live · refreshes every 5s · updated ${timeAgo(new Date(fetchedAt).toISOString(), fetchedAt)}`}
          </p>
        </div>
        <button className="mini" onClick={logout}>
          <LogOut size={14} /> Log out
        </button>
      </header>

      <section className="ad-stats">
        <StatCard icon={<Eye size={18} />} label="Total visits" value={stats.total_visits} hint="page loads" />
        <StatCard icon={<Users size={18} />} label="Unique sessions" value={stats.unique_sessions} hint="approximate" />
        <StatCard icon={<Radio size={18} />} label="Active now" value={stats.active_sessions} hint="seen in last 60s" />
        <StatCard icon={<Clock size={18} />} label="Avg. session" value={fmtDuration(stats.avg_duration_seconds)} hint="approximate" />
        <StatCard icon={<RotateCcw size={18} />} label="Replays" value={stats.replays} />
        <StatCard icon={<MessageCircle size={18} />} label="Feedback" value={stats.feedback_count} />
        <StatCard
          icon={<Star size={18} />}
          label="Avg. rating"
          value={stats.feedback_count ? `${Number(stats.feedback_avg).toFixed(1)} / 5` : "—"}
        />
      </section>

      <section className="ad-grid2">
        <div className="ad-card">
          <h2>Chapter views</h2>
          <p className="ad-muted ad-sub">How many times each chapter was opened</p>
          <div className="ad-bars">
            {stats.chapters.map((c) => (
              <div className="ad-bar-row" key={c.chapter}>
                <span className="ad-bar-label">{c.chapter + 1}. {CHAPTER_NAMES[c.chapter]}</span>
                <span className="ad-bar-track">
                  <i style={{ width: `${(c.views / maxViews) * 100}%` }} />
                </span>
                <b>{c.views}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-card">
          <h2>Chapter progression</h2>
          <p className="ad-muted ad-sub">Unique sessions that reached each chapter</p>
          <div className="ad-bars">
            {stats.chapters.map((c) => (
              <div className="ad-bar-row" key={c.chapter}>
                <span className="ad-bar-label">{c.chapter + 1}. {CHAPTER_NAMES[c.chapter]}</span>
                <span className="ad-bar-track purple">
                  <i style={{ width: `${(c.sessions / maxSessions) * 100}%` }} />
                </span>
                <b>{c.sessions}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ad-card">
        <h2>Visits · last 14 days</h2>
        <p className="ad-muted ad-sub">Days are in UTC</p>
        <div className="ad-cols">
          {stats.visits_by_day.map((d) => (
            <div className="ad-col" key={d.day} title={`${d.day}: ${d.visits}`}>
              <b>{d.visits}</b>
              <span className="ad-col-bar">
                <i style={{ height: `${(d.visits / maxDay) * 100}%` }} />
              </span>
              <small>{d.day.slice(5)}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="ad-grid2">
        <div className="ad-card">
          <h2>Recent activity</h2>
          <ul className="ad-list">
            {stats.recent_activity.length === 0 && <li className="ad-muted">No activity yet.</li>}
            {stats.recent_activity.map((e, i) => (
              <li key={`${e.session_id}-${e.created_at}-${i}`}>
                <span className="ad-chip">#{shortId(e.session_id)}</span>
                <span>{describeEvent(e)}</span>
                <small>{timeAgo(e.created_at, fetchedAt)}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="ad-card">
          <h2>Recent sessions</h2>
          <ul className="ad-list">
            {stats.recent_sessions.length === 0 && <li className="ad-muted">No sessions yet.</li>}
            {stats.recent_sessions.map((s) => (
              <li key={s.session_id} className="ad-session">
                <span className="ad-chip">
                  {s.active && <span className="ad-dot" />}#{shortId(s.session_id)}
                </span>
                <span>
                  Reached {s.max_chapter === null ? "—" : chapterLabel(s.max_chapter)}
                  <br />
                  <small>
                    {fmtDuration(s.duration_seconds)} · started{" "}
                    {new Date(s.first_seen).toLocaleString()}
                  </small>
                </span>
                <small>{timeAgo(s.last_seen, fetchedAt)}</small>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ad-card">
        <h2>Latest feedback</h2>
        {stats.latest_feedback.length === 0 && <p className="ad-muted">No feedback yet.</p>}
        <div className="ad-feedback">
          {stats.latest_feedback.map((f) => (
            <article key={f.id} className="ad-fb">
              <div className="ad-fb-top">
                <span className="ad-stars" aria-label={`${f.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={15} fill={n <= f.rating ? "currentColor" : "none"} />
                  ))}
                </span>
                <small>{new Date(f.created_at).toLocaleString()}</small>
              </div>
              <p>{f.message}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ad-card ad-note">
        <h2><Info size={16} /> What these numbers can and can't tell you</h2>
        <ul>
          <li>A &quot;session&quot; is a random ID stored in one browser tab. It is not a person.</li>
          <li>Closing the tab, using a private window, or switching device creates a new session, and one person can appear as several.</li>
          <li>Nothing here proves a visitor is Maikey (or anyone in particular). No names, emails, IPs or fingerprints are collected.</li>
          <li>Duration is the time between a session&apos;s first and last signal. It only counts time while the tab was visible, so it is approximate.</li>
          <li>Ad blockers or blocked requests can cause some visits to go unrecorded.</li>
        </ul>
      </section>
    </div>
  );
}