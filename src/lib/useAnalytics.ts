"use client";

import { useEffect, useRef } from "react";

const HEARTBEAT_MS = 30_000;
const VISITOR_COOKIE = "mk_visitor";

type EventType = "visit" | "chapter_view" | "heartbeat" | "replay";

type PageFlags = {
  visit: boolean;
  chapters: Set<number>;
};

declare global {
  interface Window {
    __mkAnalytics?: PageFlags;
  }
}

/**
 * Per-page-load flags live on `window`, so React Strict Mode and
 * dev Fast Refresh can't reset them and cause duplicate events.
 */
function flags(): PageFlags {
  if (!window.__mkAnalytics) {
    window.__mkAnalytics = { visit: false, chapters: new Set<number>() };
  }
  return window.__mkAnalytics;
}

/** Call when a different person starts using this browser. */
export function resetAnalyticsPage(): void {
  if (typeof window !== "undefined") {
    window.__mkAnalytics = undefined;
  }
}

function hasVisitorSession() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => {
    const [key, ...rest] = part.trim().split("=");
    return key === VISITOR_COOKIE && rest.join("=").length > 0;
  });
}

function post(type: EventType, chapter?: number) {
  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, chapter }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never break the website.
  }
}

/**
 * enabled     : true only once the visitor has a valid name/session.
 * chapter     : current chapter index (0-8).
 * replayCount : increases by one every time the story is replayed.
 */
export function useAnalytics(
  enabled: boolean,
  chapter: number,
  replayCount: number
) {
  const chapterRef = useRef(chapter);
  const lastReplay = useRef(replayCount);

  useEffect(() => {
    chapterRef.current = chapter;
  }, [chapter]);

  // One visit per page load.
  useEffect(() => {
    if (!enabled) return;
    const f = flags();
    if (f.visit) return;
    f.visit = true;
    post("visit");
  }, [enabled]);

  // One chapter_view per chapter per page load (Back / dots / Replay don't re-send).
  useEffect(() => {
    if (!enabled) return;
    const f = flags();
    if (f.chapters.has(chapter)) return;
    f.chapters.add(chapter);
    post("chapter_view", chapter);
  }, [enabled, chapter]);

  // One replay event per Replay click.
  useEffect(() => {
    if (replayCount === lastReplay.current) return;
    const increased = replayCount > lastReplay.current;
    lastReplay.current = replayCount;
    if (enabled && increased) post("replay", 0);
  }, [enabled, replayCount]);

  // Heartbeat: every 30s, only while the tab is visible.
  useEffect(() => {
    if (!enabled) return;

    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        post("heartbeat", chapterRef.current);
      }
    }, HEARTBEAT_MS);

    return () => window.clearInterval(id);
  }, [enabled]);
}