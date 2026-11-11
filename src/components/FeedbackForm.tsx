"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Star, Send, X, MessageCircle, Heart } from "lucide-react";
import "./feedback.css";

const createRequestId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const MAX = 1000;

type Status = "idle" | "sending" | "done";

export default function FeedbackForm({ delay = 0 }: { delay?: number }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const openedAt = useRef(0);
  const requestId = useRef(createRequestId());

  const openForm = () => {
    openedAt.current = Date.now();
    requestId.current = createRequestId();
    setOpen(true);
  };

  const close = () => {
    if (status === "sending") return;
    setOpen(false);
    setError("");
    if (status === "done") {
      setStatus("idle");
      setRating(0);
      setHover(0);
      setMessage("");
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "sending") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, status]);

  const trimmed = message.trim();
  const canSubmit = rating >= 1 && trimmed.length >= 3 && status !== "sending";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    if (trimmed.length < 3) {
      setError("Please write a short message.");
      return;
    }

    setError("");
    setStatus("sending");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          message: trimmed,
          requestId: requestId.current,
          website,
          elapsedMs: Date.now() - openedAt.current,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("done");
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Couldn't reach the server. Check your connection and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
      setStatus("idle");
    }
  };

  return (
    <>
      <button
        className="btn fb-fab rv"
        style={{ animationDelay: `${delay}s` }}
        onClick={openForm}
      >
        <MessageCircle size={16} />
        LEAVE A MESSAGE
      </button>

      {open && (
        <div
          className="fb-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="fb-card" role="dialog" aria-modal="true" aria-label="Feedback">
            <button className="fb-close" onClick={close} aria-label="Close">
              <X size={18} />
            </button>

            {status === "done" ? (
              <div className="fb-thanks">
                {Array.from({ length: 16 }, (_, i) => {
                  const angle = (i / 16) * Math.PI * 2;
                  const dist = 90 + (i % 4) * 22;
                  return (
                    <i
                      key={i}
                      className="fb-spark"
                      style={
                        {
                          "--dx": `${Math.cos(angle) * dist}px`,
                          "--dy": `${Math.sin(angle) * dist}px`,
                          animationDelay: `${(i % 5) * 0.06}s`,
                        } as React.CSSProperties
                      }
                    />
                  );
                })}

                <div className="fb-signal">
                  <span className="fb-ring" />
                  <span className="fb-ring" style={{ animationDelay: ".6s" }} />
                  <Heart size={34} fill="currentColor" />
                </div>

                <h3>Message received</h3>
                <p>Your words have reached the Batcave. Thank you for taking a moment. ❤️</p>

                <button className="btn" onClick={close}>CLOSE</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <p className="intro-label">A LITTLE SIGNAL BACK</p>
                <h3 className="fb-title">How did this feel?</h3>

                <div className="fb-stars" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className={n <= (hover || rating) ? "on" : ""}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(n)}
                    >
                      <Star size={34} fill={n <= (hover || rating) ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>

                <textarea
                  className="fb-text"
                  value={message}
                  maxLength={MAX}
                  rows={5}
                  placeholder="Write anything you'd like to say…"
                  onChange={(e) => setMessage(e.target.value)}
                  aria-label="Your message"
                />
                <div className="fb-count">{message.length} / {MAX}</div>

                {/* Honeypot: hidden from people, bots tend to fill it */}
                <div className="fb-hp" aria-hidden="true">
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </label>
                </div>

                {error && <p className="fb-error" role="alert">{error}</p>}

                <button className="btn fb-submit" type="submit" disabled={!canSubmit}>
                  <Send size={16} />
                  {status === "sending" ? "SENDING…" : "SEND"}
                </button>

                <p className="fb-privacy">
                  Only your rating, message and the first name you entered are saved.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}