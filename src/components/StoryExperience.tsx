"use client";
import { useAnalytics } from "@/lib/useAnalytics";
import FeedbackForm from "@/components/FeedbackForm";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  SkipForward,
  SkipBack,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Heart,
  Music2,
  Play,
  Pause,
  Shuffle,
  Repeat,
  BookOpen,
  Sparkles,
  Maximize,
} from "lucide-react";
import { site } from "@/config/site";

/* -------------------------------------------------------
   RANDOM HELPERS
------------------------------------------------------- */

const r = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return Math.round((x - Math.floor(x)) * 100);
};

const T = (s: number) => ({
  animationDelay: `${s}s`,
});

/* chocolate / caramel colours used inside SVGs */
const CHOC = "#c07a45";

/* how many photos to show on the Memories (flip cards) page */
const MEMORY_COUNT = 6;

/* -------------------------------------------------------
   CHAPTER 2 GAME WORDS  (edit these as you like)
------------------------------------------------------- */

const batWords = [
  { word: "BRAVE", line: "You face everything like a hero." },
  { word: "KIND", line: "Your heart is the best thing about you." },
  { word: "LOYAL", line: "Someone I can always count on." },
  { word: "FUNNY", line: "You make every day lighter." },
  { word: "SPECIAL", line: "There's no one else like you." },
  { word: "MY BATMAN", line: "Today, tomorrow, always." },
];

/* -------------------------------------------------------
   ANIMATED BACKGROUND STARS
------------------------------------------------------- */

function Sparks({
  n = 70,
  cls = "spark",
}: {
  n?: number;
  cls?: string;
}) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const size = 1.5 + r(i + 3) / 35;

        return (
          <span
            key={i}
            className={cls}
            style={{
              left: `${r(i + 1)}%`,
              top: `${r(i + 77)}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${r(i + 9) / 10}s`,
              animationDuration: `${3 + r(i + 5) / 15}s`,
            }}
          />
        );
      })}
    </>
  );
}

/* -------------------------------------------------------
   FLOATING PARTICLES
------------------------------------------------------- */

function Embers({ n = 25 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${r(i + 11)}%`,
            width: `${3 + r(i) / 25}px`,
            height: `${3 + r(i) / 25}px`,
            animationDuration: `${7 + r(i + 4) / 8}s`,
            animationDelay: `${r(i + 6) / 6}s`,
          }}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------
   BAT SHAPE (reused everywhere)
------------------------------------------------------- */

const BAT_PATH =
  "M50 22 C42 14 26 16 12 24 C20 27 22 34 25 41 C33 35 41 37 50 48 C59 37 67 35 75 41 C78 34 80 27 88 24 C74 16 58 14 50 22Z";

function Bats({ n = 6 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <svg
          key={i}
          className="flybat"
          viewBox="0 0 100 60"
          aria-hidden="true"
          style={{
            top: `${8 + r(i + 20) * 0.6}%`,
            width: `${28 + r(i + 2) / 2.5}px`,
            opacity: 0.8,
            color: CHOC,
            animationDuration: `${12 + r(i + 7) / 5}s`,
            animationDelay: `${4 + i * 2.4}s`,
          }}
        >
          <path d={BAT_PATH} fill="currentColor" />
        </svg>
      ))}
    </>
  );
}

function BurstBats({ n = 14 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <svg
          key={i}
          className="burstbat"
          viewBox="0 0 100 60"
          aria-hidden="true"
          style={
            {
              width: `${34 + r(i + 3) / 3}px`,
              "--x": `${(r(i + 1) - 50) * 14}px`,
              "--y": `${(r(i + 31) - 50) * 9}px`,
              animationDelay: `${2.3 + i * 0.09}s`,
            } as React.CSSProperties
          }
        >
          <path d={BAT_PATH} fill="#0b0b14" stroke={CHOC} strokeWidth="2" />
        </svg>
      ))}
    </>
  );
}

/* -------------------------------------------------------
   TEXT ANIMATION
------------------------------------------------------- */

function Lines({
  lines,
  start = 0,
  step = 1.8,
  big = -1,
}: {
  lines: string[];
  start?: number;
  step?: number;
  big?: number;
}) {
  return (
    <>
      {lines.map((text, i) => (
        <p
          key={i}
          className={`rv text-center ${i === big ? "title" : "txt"}`}
          style={T(start + i * step)}
        >
          {text}
        </p>
      ))}
    </>
  );
}

function Btn({
  at,
  onClick,
  children,
}: {
  at: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button className="btn rv" style={T(at)} onClick={onClick}>
      {children}
      <ArrowRight size={16} />
    </button>
  );
}

function Chap({
  children,
  deco,
}: {
  children: ReactNode;
  deco?: ReactNode;
}) {
  return (
    <section className="chap">
      <div className="deco">{deco}</div>
      <div className="stack">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------
   BATMAN SYMBOL (with ripples)
------------------------------------------------------- */

function BatSignal() {
  return (
    <div className="signal">
      <span className="ripple" />
      <span className="ripple" style={T(1.2)} />

      <svg viewBox="0 0 100 100" width="170" height="170" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill={CHOC} opacity=".2" />

        <circle
          className="dash"
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke={CHOC}
          strokeWidth="0.8"
          strokeDasharray="3 5"
        />

        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={CHOC}
          strokeWidth="1.5"
        />

        <path
          d="M50 38 C42 30 26 32 12 40 C20 43 22 50 25 57 C33 51 41 53 50 64 C59 53 67 51 75 57 C78 50 80 43 88 40 C74 32 58 30 50 38Z"
          fill="#050509"
        />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------
   NAME GATE (shown first, before the story starts)
   onSubmit resolves to an error message, or null on success.
------------------------------------------------------- */

function NameGate({
  onSubmit,
}: {
  onSubmit: (name: string) => Promise<string | null>;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;

    const clean = value.trim().slice(0, 40);
    if (clean.length < 2) {
      setError("Please enter your name to begin.");
      return;
    }

    setBusy(true);
    setError("");

    const problem = await onSubmit(clean);

    /* on success the gate unmounts, so only reset when there's a problem */
    if (problem) {
      setError(problem);
      setBusy(false);
    }
  };

  return (
    <section className="chap">
      <div className="deco">
        <Sparks cls="star" n={60} />
        <div className="fog" />
      </div>

      <div className="stack">
        <div style={{ opacity: 1 }}>
          <svg
            viewBox="0 0 100 60"
            width="90"
            height="54"
            aria-hidden="true"
            style={{ color: CHOC, filter: "drop-shadow(0 0 12px #c07a45)" }}
          >
            <path d={BAT_PATH} fill="currentColor" />
          </svg>
        </div>

        <p className="intro-label rv">BEFORE THE STORY BEGINS</p>

        <h1 className="title rv text-center" style={T(0.2)}>
          Who's there?
        </h1>

        <p className="txt rv text-center" style={T(0.4)}>
          Tell me your name so I know who is watching.
        </p>

        <input
          className="rv"
          style={{
            ...T(0.6),
            width: "100%",
            maxWidth: "22rem",
            padding: "0.9rem 1.1rem",
            borderRadius: "999px",
            border: "1px solid var(--gold)",
            background: "#0008",
            color: "var(--soft)",
            fontSize: "1rem",
            textAlign: "center",
            outline: "none",
          }}
          type="text"
          autoFocus
          maxLength={40}
          placeholder="Your name"
          value={value}
          disabled={busy}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />

        {error && (
          <p
            role="alert"
            style={{
              color: "#f87171",
              fontSize: ".85rem",
              textAlign: "center",
              maxWidth: "22rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          className="btn rv"
          style={{ ...T(0.8), opacity: busy ? 0.6 : 1 }}
          onClick={submit}
          disabled={busy}
        >
          {busy ? "ONE MOMENT…" : "ENTER THE STORY"}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   PHOTO PRELOAD (so slides appear instantly)
------------------------------------------------------- */

function usePreload(urls: string[]) {
  useEffect(() => {
    urls.forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  }, [urls]);
}

/* -------------------------------------------------------
   AUTO SLIDESHOW  (used in Maikey's chapter)
------------------------------------------------------- */

function AutoShow() {
  const photos = site.photos;
  const [i, setI] = useState(0);

  usePreload(photos.map((p) => p.image));

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % photos.length), 3200);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <div className="show rv" style={T(0.3)}>
      {photos.map((p, n) => (
        <div key={n} className={`show-item ${n === i ? "on" : ""}`}>
          <img className="slide-bg" src={p.image} alt="" aria-hidden="true" />
          <img className="slide-img" src={p.image} alt={p.title} />
        </div>
      ))}

      <div className="show-dots">
        {photos.map((_, n) => (
          <i key={n} className={n === i ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   CHAPTER 1 - CINEMATIC BIRTHDAY INTRO
------------------------------------------------------- */

function Ch1({ next }: { next: () => void }) {
  const introLines = [
    "Somewhere in this universe,",
    "someone extraordinary was born.",
    "Maithreyan.",
    "My favorite human. My Batman.",
  ];

  return (
    <Chap
      deco={
        <>
          <Sparks cls="star" n={90} />
          <div className="rays" />
          <div className="sweep l" />
          <div className="sweep r" />
          <div className="fog" />
          <div className="fog f2" />
          <Embers />
          <BurstBats />
          <Bats />

          <div className="flash" />
          <div className="bars t" />
          <div className="bars b" />
          <div className="hline" />
        </>
      }
    >
      <BatSignal />

      <div className="intro-content">
        <p className="intro-label rv" style={T(4)}>
          A LITTLE UNIVERSE OF MY OWN
        </p>

        <Lines lines={introLines} start={4.8} step={1.4} big={2} />

        <p className="intro-subtitle rv" style={T(10.2)}>
          Made with love, just for you.
        </p>

        <Btn at={11.5} onClick={next}>
          LET THE MAGIC BEGIN
        </Btn>
      </div>
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 2 - MEMORY CONSTELLATION (replaces the old moon)

   Six stars trace a bat's wings. Every word you catch
   lights its star, joins the lines, and brings the golden
   bat-signal beam in the portal a little closer to full.
   Tap a lit star to read its words again.
   Pure SVG + CSS, no extra libraries or images.
------------------------------------------------------- */

/* star positions follow the outline of BAT_PATH (scale 5.2, offset 40,10) */
const STAR_SLOTS = [
  { x: 102, y: 135 } /* BRAVE: left wingtip   */,
  { x: 175, y: 93 } /* KIND: left wing peak   */,
  { x: 300, y: 124 } /* LOYAL: the head        */,
  { x: 425, y: 93 } /* FUNNY: right wing peak */,
  { x: 498, y: 135 } /* SPECIAL: right wingtip */,
  { x: 300, y: 260 } /* MY BATMAN: the heart   */,
];

const STAR_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [2, 5],
];

const STAR_PATH =
  "M0,-13 L3,-3 L13,0 L3,3 L0,13 L-3,3 L-13,0 L-3,-3Z";

const CH2_CSS = `
.c2-arena{
  --px:0; --py:0; --lit:0;
  position:relative; width:100%;
  height:clamp(15rem,42vh,22rem);
  overflow:hidden; border-radius:16px;
  border:1px solid #c07a4555;
  background:
    radial-gradient(ellipse at 50% 115%, #4b2487aa, transparent 62%),
    radial-gradient(ellipse at 18% 18%, #2c1556cc, transparent 55%),
    radial-gradient(ellipse at 85% 28%, #4a1f6a77, transparent 50%),
    #07060f;
  box-shadow: inset 0 0 70px #000, inset 0 0 130px #1a0c3a, 0 0 46px #c07a4524;
  touch-action:manipulation; user-select:none; -webkit-user-select:none;
}
.c2-layer{ position:absolute; inset:-7%; pointer-events:none; transition:transform .3s ease-out; }
.c2-back{ transform:translate(calc(var(--px)*-8px), calc(var(--py)*-6px)); }
.c2-mid{ transform:translate(calc(var(--px)*-14px), calc(var(--py)*-10px)); }
.c2-front{ transform:translate(calc(var(--px)*-22px), calc(var(--py)*-14px)); }

.c2-nebula{
  position:absolute; inset:0;
  background:
    radial-gradient(circle at 30% 60%, #7c3aed33, transparent 40%),
    radial-gradient(circle at 72% 38%, #c07a4522, transparent 38%);
  animation:c2-drift 18s ease-in-out infinite alternate;
}
.c2-beam{
  position:absolute; left:50%; bottom:-6%;
  width:78%; height:125%; transform:translateX(-50%);
  clip-path:polygon(45% 100%, 55% 100%, 100% 0, 0 0);
  background:linear-gradient(to top, #ffd89a, #e6a85a66 38%, transparent 85%);
  filter:blur(7px);
  opacity:calc(.1 + var(--lit) * .62);
  transition:opacity 1.2s ease;
  animation:c2-breathe 5s ease-in-out infinite;
}
.c2-floor{
  position:absolute; left:50%; bottom:-2%;
  width:70%; height:22%; transform:translateX(-50%);
  background:radial-gradient(ellipse at center, #f0c27a88, #c07a4522 45%, transparent 70%);
  opacity:calc(.25 + var(--lit) * .75);
  transition:opacity 1.2s ease;
}
.c2-mote{
  position:absolute; bottom:-4%; border-radius:50%;
  background:radial-gradient(circle, #ffe3a8, #e6a85a 55%, transparent 72%);
  box-shadow:0 0 8px #e6a85a;
  opacity:0; animation:c2-rise linear infinite;
}
.c2-svg{
  position:absolute; inset:0; width:100%; height:100%;
  pointer-events:none; overflow:visible;
}
.c2-vignette{
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse at 50% 48%, transparent 55%, #000000cc 100%);
}

.c2-ghost{ transition:opacity 1.2s ease; }
.c2-ring-a, .c2-ring-b{ transform-origin:300px 150px; }
.c2-ring-a{ animation:c2-rot 70s linear infinite; }
.c2-ring-b{ animation:c2-rot 46s linear infinite reverse; }
.c2-done .c2-ring-a{ animation-duration:24s; }
.c2-done .c2-ring-b{ animation-duration:16s; }

.c2-link{ stroke:#f0c27a; stroke-width:1.2; opacity:.14; transition:opacity .8s ease, stroke-width .8s ease; }
.c2-link.on{ opacity:.95; stroke-width:2; filter:drop-shadow(0 0 5px #f0c27a); }

.c2-star{ pointer-events:auto; outline:none; }
.c2-star.lit{ cursor:pointer; }
.c2-pop{ transform-box:fill-box; transform-origin:center; }
.c2-star.lit .c2-pop{ animation:c2-pop .9s cubic-bezier(.2,1.4,.4,1) both; }
.c2-core{ transform-box:fill-box; transform-origin:center; animation:c2-twinkle 3.2s ease-in-out infinite; filter:drop-shadow(0 0 8px #ffd89a); }
.c2-pending{ transform-box:fill-box; transform-origin:center; animation:c2-wait 3s ease-in-out infinite; }
.c2-star:focus-visible .c2-focus{ stroke:#ffe3a8; stroke-opacity:1; }
.c2-label{ font-size:17px; font-weight:700; letter-spacing:.14em; fill:#f3d3b4; paint-order:stroke; stroke:#07060f; stroke-width:4px; }
.c2-pulse{ transform-box:fill-box; transform-origin:center; fill:none; stroke:#f0c27a; stroke-width:1.5; animation:c2-pulse 3.4s ease-out infinite; }

@keyframes c2-drift{ from{ transform:translate(-2%,1%) scale(1); } to{ transform:translate(2%,-1%) scale(1.06); } }
@keyframes c2-breathe{ 0%,100%{ filter:blur(7px) brightness(1); } 50%{ filter:blur(9px) brightness(1.25); } }
@keyframes c2-rise{
  0%{ transform:translateY(0) translateX(0); opacity:0; }
  15%{ opacity:.9; }
  100%{ transform:translateY(-26rem) translateX(1.2rem); opacity:0; }
}
@keyframes c2-rot{ to{ transform:rotate(360deg); } }
@keyframes c2-pop{ 0%{ transform:scale(.2); opacity:0; } 100%{ transform:scale(1); opacity:1; } }
@keyframes c2-twinkle{ 0%,100%{ transform:scale(1) rotate(0deg); opacity:1; } 50%{ transform:scale(1.18) rotate(8deg); opacity:.82; } }
@keyframes c2-wait{ 0%,100%{ transform:scale(1); opacity:.35; } 50%{ transform:scale(1.5); opacity:.8; } }
@keyframes c2-pulse{ 0%{ transform:scale(.4); opacity:.9; } 100%{ transform:scale(2.6); opacity:0; } }

@media (prefers-reduced-motion: reduce){
  .c2-arena *{ animation:none !important; transition:none !important; }
  .c2-mote{ display:none; }
}
`;

function Constellation({
  caught,
  last,
  done,
  onPick,
}: {
  caught: number[];
  last: number | null;
  done: boolean;
  onPick: (word: number) => void;
}) {
  const progress = caught.length / batWords.length;

  return (
    <svg
      className="c2-svg"
      viewBox="0 0 600 300"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="A bat-shaped constellation that lights up as you catch words"
    >
      <defs>
        <radialGradient id="c2-glow">
          <stop offset="0" stopColor="#ffe3a8" stopOpacity=".95" />
          <stop offset=".35" stopColor="#e6a85a" stopOpacity=".42" />
          <stop offset="1" stopColor="#c07a45" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ghost bat-signal: brightens as the portal fills */}
      <g transform="translate(40 10) scale(5.2)">
        <path
          className="c2-ghost"
          d={BAT_PATH}
          fill="#c07a45"
          stroke="#f0c27a"
          strokeWidth=".25"
          style={{ opacity: 0.05 + progress * 0.3 }}
        />
      </g>

      {/* slow rotating portal rings */}
      <g className="c2-ring-a">
        <circle
          cx="300"
          cy="150"
          r="132"
          fill="none"
          stroke="#f0c27a"
          strokeOpacity=".4"
          strokeWidth="1"
          strokeDasharray="2 9"
        />
      </g>
      <g className="c2-ring-b">
        <circle
          cx="300"
          cy="150"
          r="108"
          fill="none"
          stroke="#c07a45"
          strokeOpacity=".5"
          strokeWidth="1.2"
          strokeDasharray="16 12"
        />
      </g>

      {/* the final blaze when everything is caught */}
      {done && (
        <>
          <circle className="c2-pulse" cx="300" cy="150" r="60" />
          <circle
            className="c2-pulse"
            cx="300"
            cy="150"
            r="60"
            style={{ animationDelay: "1.7s" }}
          />
        </>
      )}

      {/* constellation lines */}
      {STAR_LINKS.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          className={`c2-link ${caught.includes(a) && caught.includes(b) ? "on" : ""}`}
          x1={STAR_SLOTS[a].x}
          y1={STAR_SLOTS[a].y}
          x2={STAR_SLOTS[b].x}
          y2={STAR_SLOTS[b].y}
        />
      ))}

      {/* the stars */}
      {STAR_SLOTS.map((p, i) => {
        const lit = caught.includes(i);
        const selected = last === i;

        return (
          <g
            key={i}
            className={`c2-star ${lit ? "lit" : ""}`}
            transform={`translate(${p.x} ${p.y})`}
            role={lit ? "button" : undefined}
            tabIndex={lit ? 0 : -1}
            aria-label={lit ? `Read about ${batWords[i].word} again` : undefined}
            aria-hidden={lit ? undefined : true}
            onPointerDown={lit ? () => onPick(i) : undefined}
            onKeyDown={
              lit
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPick(i);
                    }
                  }
                : undefined
            }
          >
            {lit ? (
              <g className="c2-pop">
                <circle r={selected ? 40 : 30} fill="url(#c2-glow)" />
                <path
                  className="c2-core"
                  d={STAR_PATH}
                  fill="#ffe3a8"
                  transform={selected ? "scale(1.35)" : undefined}
                />
                <circle
                  className="c2-focus"
                  r="22"
                  fill="none"
                  stroke="#ffe3a8"
                  strokeOpacity={selected ? 0.7 : 0}
                  strokeWidth="1.2"
                />
                <circle r="30" fill="transparent" />
                <text className="c2-label" y="-24" textAnchor="middle">
                  {batWords[i].word}
                </text>
              </g>
            ) : (
              <g>
                <circle
                  className="c2-pending"
                  r="6"
                  fill="none"
                  stroke="#c07a45"
                  strokeWidth="1"
                />
                <circle r="2.2" fill="#c07a45" opacity=".6" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------
   CHAPTER 2 - THE GIFT + BAT-CATCHING ACTION GAME
------------------------------------------------------- */

type FlyBat = {
  id: number;
  word: number; /* index into batWords */
  x: number; /* % of arena width */
  y: number; /* % of arena height */
  vx: number; /* % per second (sign = direction) */
  base: number; /* base y % */
  amp: number; /* wobble height % */
  freq: number; /* wobble speed */
  phase: number;
  age: number;
};

function Ch2({ next }: { next: () => void }) {
  const [open, setOpen] = useState(false);
  const [game, setGame] = useState(false);

  /* action game state */
  const [bats, setBats] = useState<FlyBat[]>([]);
  const [caught, setCaught] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);

  const batsRef = useRef<FlyBat[]>([]);
  const caughtRef = useRef<number[]>([]);
  const idRef = useRef(0);
  const arenaRef = useRef<HTMLDivElement>(null);

  const total = batWords.length;
  const done = caught.length === total;

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setGame(true), 1900);
    return () => clearTimeout(t);
  }, [open]);

  /* the game loop: spawn, move, remove off-screen bats */
  useEffect(() => {
    if (!game || done) return;

    let raf = 0;
    let prev = performance.now();
    let spawnTimer = 0.6;

    const loop = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      spawnTimer += dt;

      let list = batsRef.current;

      /* spawn a new bat carrying a word that is not caught yet */
      if (spawnTimer > 0.9 && list.length < 4) {
        const onScreen = new Set(list.map((b) => b.word));
        const choices = batWords
          .map((_, i) => i)
          .filter((i) => !caughtRef.current.includes(i) && !onScreen.has(i));

        if (choices.length) {
          const word = choices[Math.floor(Math.random() * choices.length)];
          const fromLeft = Math.random() < 0.5;
          const speed = 17 + Math.random() * 10;

          list = [
            ...list,
            {
              id: idRef.current++,
              word,
              x: fromLeft ? -12 : 112,
              y: 50,
              vx: fromLeft ? speed : -speed,
              base: 22 + Math.random() * 52,
              amp: 6 + Math.random() * 10,
              freq: 2 + Math.random() * 2,
              phase: Math.random() * Math.PI * 2,
              age: 0,
            },
          ];
        }
        spawnTimer = 0;
      }

      /* move bats (flying in a wavy line) and drop the ones that left */
      list = list
        .map((b) => {
          const age = b.age + dt;
          return {
            ...b,
            age,
            x: b.x + b.vx * dt,
            y: b.base + Math.sin(age * b.freq + b.phase) * b.amp,
          };
        })
        .filter((b) => b.x > -18 && b.x < 118);

      batsRef.current = list;
      setBats(list);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [game, done]);

  /* when everything is caught, clear the sky */
  useEffect(() => {
    if (done) {
      batsRef.current = [];
      setBats([]);
    }
  }, [done]);

  const catchBat = (id: number) => {
    const b = batsRef.current.find((x) => x.id === id);
    if (!b) return;

    batsRef.current = batsRef.current.filter((x) => x.id !== id);
    caughtRef.current = [...caughtRef.current, b.word];

    setBats(batsRef.current);
    setCaught(caughtRef.current);
    setLast(b.word);
  };

  /* gentle depth: layers shift slightly with the pointer (no re-render) */
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = arenaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty("--px", px.toFixed(3));
    el.style.setProperty("--py", py.toFixed(3));
  };

  const resetTilt = () => {
    const el = arenaRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  return (
    <Chap
      deco={
        <>
          <Sparks cls="spark" n={50} />
          <div className="fog" />
        </>
      }
    >
      {!game ? (
        <>
          <p className="txt rv text-center">{site.gift.text}</p>

          <div className={`box ${open ? "open" : ""}`} aria-hidden="true">
            <div className="beam" />

            <div className="base">
              <i className="rib v" />
              <i className="rib h" />
            </div>

            <div className="lid">
              <i className="rib v" />
              <span className="bow" />
            </div>

            {open &&
              Array.from({ length: 30 }, (_, i) => (
                <b
                  key={i}
                  className="bp"
                  style={
                    {
                      "--dx": `${(r(i) - 50) * 4}px`,
                      "--dy": `${-r(i + 40) * 3.5}px`,
                      animationDelay: `${r(i + 2) / 200}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
          </div>

          {!open ? (
            <button className="btn" onClick={() => setOpen(true)}>
              {site.gift.button}
            </button>
          ) : (
            <p className="txt rv text-center" style={T(0.8)}>
              Something is waking up inside the box...
            </p>
          )}
        </>
      ) : (
        <div className="mission">
          <style>{CH2_CSS}</style>

          <p className="mission-title rv">
            {done ? site.gift.surprise : "Catch the bats, Batman!"}
          </p>

          <p className="mission-description rv" style={T(0.3)}>
            {done
              ? "You caught every one. Each bat carried a word about you."
              : "Tap the flying bats before they escape. Each one carries a word about you."}
          </p>

          {/* the portal: a golden bat-signal and a constellation that fills as you play */}
          <div
            ref={arenaRef}
            className={`c2-arena rv ${done ? "c2-done" : ""}`}
            style={
              {
                ...T(0.5),
                "--lit": caught.length / total,
              } as React.CSSProperties
            }
            onPointerMove={tilt}
            onPointerLeave={resetTilt}
          >
            <div className="c2-layer c2-back" aria-hidden="true">
              <div className="c2-nebula" />
              <div className="c2-beam" />
              <div className="c2-floor" />
            </div>

            <div className="c2-layer c2-mid" aria-hidden="true">
              {Array.from({ length: 22 }, (_, i) => {
                const size = 2 + r(i + 5) / 30;
                return (
                  <span
                    key={i}
                    className="c2-mote"
                    style={{
                      left: `${r(i + 2)}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      animationDuration: `${7 + r(i + 8) / 9}s`,
                      animationDelay: `${r(i + 13) / 12}s`,
                    }}
                  />
                );
              })}
            </div>

            <Constellation
              caught={caught}
              last={last}
              done={done}
              onPick={setLast}
            />

            <div className="c2-vignette" aria-hidden="true" />

            {bats.map((b) => {
              const flap = 0.7 + 0.3 * Math.abs(Math.sin(b.age * 14));
              return (
                <button
                  key={b.id}
                  aria-label={`Catch the bat carrying ${batWords[b.word].word}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    catchBat(b.id);
                  }}
                  style={{
                    position: "absolute",
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: ".15rem",
                    padding: ".6rem .8rem",
                    background: "transparent",
                    border: 0,
                    cursor: "pointer",
                    color: CHOC,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <svg
                    viewBox="0 0 100 60"
                    width="64"
                    height="38"
                    aria-hidden="true"
                    style={{
                      transform: `scaleX(${b.vx < 0 ? -1 : 1}) scaleY(${flap})`,
                      filter: "drop-shadow(0 0 10px #c07a45aa)",
                    }}
                  >
                    <path d={BAT_PATH} fill="currentColor" />
                  </svg>

                  <span
                    style={{
                      padding: ".15rem .55rem",
                      borderRadius: "999px",
                      border: "1px solid #c07a4599",
                      background: "#100d1c",
                      color: "#e6bd98",
                      fontSize: ".7rem",
                      fontWeight: 700,
                      letterSpacing: ".1em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {batWords[b.word].word}
                  </span>
                </button>
              );
            })}
          </div>

          {/* the line that goes with the last caught bat (or the star you tapped) */}
          <div
            className="rv"
            style={{ ...T(0.7), minHeight: "3.2rem", textAlign: "center" }}
          >
            {last !== null && (
              <div key={last} style={{ animation: "in .6s both" }}>
                <b
                  style={{
                    color: "var(--gold-l)",
                    letterSpacing: ".14em",
                    fontSize: "1.1rem",
                  }}
                >
                  {batWords[last].word}
                </b>
                <p style={{ margin: ".25rem 0 0", color: "#f5f2ff" }}>
                  {batWords[last].line}
                </p>
              </div>
            )}
          </div>

          <div className="mission-progress">
            <Sparkles size={14} />
            {caught.length} / {total} BATS CAUGHT
          </div>

          {done && (
            <Btn at={0.6} onClick={next}>
              {site.gift.next}
            </Btn>
          )}
        </div>
      )}
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 3 - MEMORIES WITH FLIP CARDS (first 6 photos only)
------------------------------------------------------- */

function Ch3({ next }: { next: () => void }) {
  const [flipped, setFlipped] = useState<number[]>([]);

  /* only the first 6 photos are shown on this page */
  const memories = site.photos.slice(0, MEMORY_COUNT);

  const toggle = (i: number) =>
    setFlipped((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));

  return (
    <Chap
      deco={
        <>
          <Sparks n={40} />
          <div className="fog" />
        </>
      }
    >
      <div className="memory-heading">
        <p className="intro-label rv">{site.memoriesTitle}</p>

        <h1 className="title rv text-center">Little Moments. Big Memories.</h1>

        <p className="txt rv text-center" style={T(0.3)}>
          Every picture holds a little piece of us.
          <br />
          Tap each memory to reveal what's behind it.
        </p>
      </div>

      <div className="memory-grid">
        {memories.map((memory, i) => (
          <div
            key={i}
            className={`memory-card rv ${flipped.includes(i) ? "flipped" : ""}`}
            style={T(0.5 + i * 0.35)}
            onClick={() => toggle(i)}
          >
            <div className="memory-card-inner">
              <div className="memory-front">
                <img src={memory.image} alt={memory.title} loading="lazy" />

                <div className="memory-overlay">
                  <span className="memory-number">
                    MEMORY {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3>{memory.title}</h3>

                  <span className="flip-hint">
                    <Heart size={13} />
                    Tap to reveal
                  </span>
                </div>
              </div>

              <div className="memory-back">
                <Heart size={24} className="memory-heart" />

                <span className="memory-number">A LITTLE NOTE FOR YOU</span>

                <p>{memory.message}</p>

                <span className="memory-back-footer">
                  Always, your favorite person.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Btn at={4} onClick={next}>
        KEEP THE STORY GOING
      </Btn>
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 4 - MAIKEY'S CHAPTER (photo slideshow, no ring)
------------------------------------------------------- */

function Ch4({ next }: { next: () => void }) {
  return (
    <Chap
      deco={
        <>
          <Sparks cls="star" n={60} />
          <Sparks n={30} />
          <div className="fog" />
        </>
      }
    >
      <AutoShow />

      <Lines lines={site.maikeyChapter.lines} start={1} step={2} big={3} />

      <p
        className="txt rv text-center"
        style={{
          ...T(9.5),
          opacity: 0.85,
        }}
      >
        {site.maikeyChapter.message}
      </p>

      <Btn at={11} onClick={next}>
        CONTINUE
      </Btn>
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 5 - SONGS  (Spotify theme, links open Spotify)
------------------------------------------------------- */

const spArt = [
  "linear-gradient(135deg,#1db954,#0d5c2a)",
  "linear-gradient(135deg,#8b5cf6,#3b1d8f)",
  "linear-gradient(135deg,#c07a45,#6b3a1a)",
  "linear-gradient(135deg,#ec4899,#7a1d4f)",
];

function Ch5({ next }: { next: () => void }) {
  const songs = site.songs;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);

  const current = songs[active];

  const artStyle = (i: number) =>
    songs[i].cover
      ? {
          backgroundImage: `url(${songs[i].cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { background: spArt[i % spArt.length] };

  const openSong = (url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const pick = (i: number) => {
    setActive(i);
    setPlaying(true);
    openSong(songs[i].url);
  };

  const step = (dir: 1 | -1) => {
    setActive((a) => (a + dir + songs.length) % songs.length);
    setPlaying(true);
  };

  const toggleLike = (i: number) =>
    setLiked((l) => (l.includes(i) ? l.filter((x) => x !== i) : [...l, i]));

  return (
    <Chap deco={<div className="sp-bg" />}>
      <div className="sp-wrap">
        <header className="sp-head rv">
          <div className="sp-cover" aria-hidden="true">
            <Music2 size={64} />
          </div>

          <div className="sp-head-text">
            <span className="sp-kind">Playlist</span>
            <h1 className="sp-title">A Soundtrack for You</h1>
            <p className="sp-sub">
              Some feelings are easier to say through music. Tap a song to
              open it on Spotify.
            </p>
            <p className="sp-meta">
              <b>Made for {site.name}</b> · {songs.length} songs
            </p>
          </div>
        </header>

        <p className="sp-line rv" style={T(0.3)}>
          <Heart size={16} fill="currentColor" />
          {site.songsLine}
        </p>

        <div className="sp-controls rv" style={T(0.4)}>
          <button
            className="sp-bigplay"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause size={26} fill="currentColor" />
            ) : (
              <Play size={26} fill="currentColor" />
            )}
          </button>
          <Shuffle size={22} className="sp-ico" aria-hidden="true" />
        </div>

        <div className="sp-list rv" style={T(0.7)} role="list">
          <div className="sp-row sp-row-head" aria-hidden="true">
            <span className="sp-num">#</span>
            <span>Title</span>
            <span className="sp-col-note">Why it reminds me of you</span>
            <span />
          </div>

          {songs.map((song, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                role="listitem"
                className={`sp-row ${isActive ? "active" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="sp-num">
                  {isActive && playing ? (
                    <span className="sp-eq" aria-label="Playing">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <>
                      <span className="sp-n">{i + 1}</span>
                      <Play
                        size={14}
                        fill="currentColor"
                        className="sp-hoverplay"
                      />
                    </>
                  )}
                </span>

                <span className="sp-song">
                  <span
                    className="sp-art"
                    style={artStyle(i)}
                    aria-hidden="true"
                  >
                    {!song.cover && <Music2 size={18} />}
                  </span>
                  <span className="sp-song-text">
                    <b className="sp-song-title">{song.title}</b>
                    <small>{song.artist}</small>
                  </span>
                </span>

                <span className="sp-col-note sp-note">{song.note}</span>

                <button
                  className={`sp-like ${liked.includes(i) ? "on" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(i);
                  }}
                  aria-label="Like song"
                >
                  <Heart
                    size={18}
                    fill={liked.includes(i) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="sp-player rv" style={T(1)}>
          <div className="sp-now">
            <span
              className="sp-art"
              style={artStyle(active)}
              aria-hidden="true"
            >
              {!current.cover && <Music2 size={18} />}
            </span>
            <span className="sp-song-text">
              <b className="sp-song-title">{current.title}</b>
              <small>{current.artist}</small>
            </span>
          </div>

          <div className="sp-center">
            <div className="sp-btns">
              <button onClick={() => step(-1)} aria-label="Previous song">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button
                className="sp-mainplay"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </button>
              <button onClick={() => step(1)} aria-label="Next song">
                <SkipForward size={20} fill="currentColor" />
              </button>
              <Repeat size={16} className="sp-ico sp-repeat" aria-hidden="true" />
            </div>

            <div className="sp-bar" aria-hidden="true">
              <i
                key={active}
                className="sp-fill"
                style={{ animationPlayState: playing ? "running" : "paused" }}
              />
            </div>
          </div>

          <div className="sp-open">
            {current.url ? (
              <a
                className="sp-listen"
                href={current.url}
                target="_blank"
                rel="noreferrer"
              >
                Listen on Spotify
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="sp-nolink">Add a Spotify link in site.ts</span>
            )}
          </div>
        </div>

        <button className="sp-next rv" style={T(1.3)} onClick={next}>
          Next chapter
          <ArrowRight size={16} />
        </button>
      </div>
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 6 - BIRTHDAY CAKE
------------------------------------------------------- */

function Ch6({ next }: { next: () => void }) {
  return (
    <Chap
      deco={
        <>
          {Array.from({ length: 40 }, (_, i) => (
            <i
              key={i}
              className="conf"
              style={{
                left: `${r(i)}%`,
                background: i % 2 ? CHOC : "#8B5CF6",
                animationDuration: `${4 + r(i + 3) / 15}s`,
                animationDelay: `${r(i + 8) / 12}s`,
              }}
            />
          ))}

          <Sparks n={30} />
        </>
      }
    >
      <h1 className="title rv text-center" style={T(0.3)}>
        {site.birthdayWish.headline}
      </h1>

      <p className="txt rv text-center" style={T(2)}>
        {site.birthdayWish.sub}
      </p>

      <div className="cake rv" style={T(3.5)} aria-hidden="true">
        <div className="candles">
          {[0, 1, 2].map((i) => (
            <div key={i} className="candle">
              <div className="flame" style={T(i * 0.1)} />
            </div>
          ))}
        </div>

        <div className="layer l1" />
        <div className="layer l2" />
        <div className="plate" />
      </div>

      <p className="txt rv text-center" style={T(5.5)}>
        {site.birthdayWish.message}
      </p>

      <Btn at={7} onClick={next}>
        ONE LAST THING
      </Btn>
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 7 - VIDEO (landscape)
------------------------------------------------------- */

function Ch7({ next }: { next: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null);

  const watchLandscape = async () => {
    const el = frameRef.current;
    if (!el) return;

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }

      const orientation = screen.orientation as any;
      if (orientation?.lock) {
        await orientation.lock("landscape");
      }
    } catch {
      /* some browsers don't allow orientation lock - fullscreen still works */
    }
  };

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) {
        try {
          (screen.orientation as any)?.unlock?.();
        } catch {
          /* ignore */
        }
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <Chap
      deco={
        <>
          <Sparks cls="star" n={55} />
          <div className="fog" />
        </>
      }
    >
      <div className="video-heading">
        <p className="intro-label rv">A MOMENT JUST FOR YOU</p>

        <h1 className="title rv text-center">Press Play, Batman.</h1>

        <p className="txt rv text-center">
          A little clip, a little memory,
          <br />
          and a whole lot of love.
        </p>
      </div>

      <div ref={frameRef} className="video-frame rv" style={T(1.5)}>
        <video
          className="birthday-video"
          controls
          playsInline
          preload="metadata"
          src={site.birthdayVideo}
        >
          Your browser does not support video playback.
        </video>
      </div>

      <button className="btn rv" style={T(1.8)} onClick={watchLandscape}>
        <Maximize size={16} />
        WATCH IN LANDSCAPE
      </button>

      <p className="video-caption rv" style={T(2)}>
        Made with love. Saved for you.
      </p>

      <Btn at={3} onClick={next}>
        THERE'S MORE
      </Btn>
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 8 - THE STORY (handwritten letter theme)
------------------------------------------------------- */

function Ch8({ next }: { next: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const s = site.story;

  const bodyStart = 1.2;
  const bodyStep = 1.6;
  const signAt = bodyStart + s.body.length * bodyStep;

  return (
    <Chap
      deco={
        <>
          <Sparks cls="star" n={70} />
          <div className="fog" />
        </>
      }
    >
      <div className="story-heading">
        <BookOpen size={30} className="gold" />

        <p className="intro-label rv">A STORY I'VE BEEN KEEPING</p>

        <h1 className="title rv text-center">{s.heading}</h1>

        <p className="txt rv text-center">{s.intro}</p>
      </div>

      {!revealed ? (
        <button
          className="btn story-reveal-button"
          onClick={() => setRevealed(true)}
        >
          <Sparkles size={16} />
          {s.button}
          <ArrowRight size={16} />
        </button>
      ) : (
        <article className="lt rv">
          <span className="lt-seal" aria-hidden="true">
            <Heart size={20} fill="currentColor" />
          </span>

          <p className="lt-kicker">a letter, just for you</p>

          <h2 className="lt-to rv" style={T(0.4)}>
            {s.to}
          </h2>

          {s.body.map((p, i) => (
            <p key={i} className="lt-p rv" style={T(bodyStart + i * bodyStep)}>
              {p}
            </p>
          ))}

          <p className="lt-sign rv" style={T(signAt)}>
            {s.signoff}
          </p>
        </article>
      )}

      <Btn at={4} onClick={next}>
        ONE LAST CHAPTER
      </Btn>
    </Chap>
  );
}

/* -------------------------------------------------------
   CHAPTER 9 - FINAL LETTER (photo background, NO oval photo)
------------------------------------------------------- */

function Ch9({ replay }: { replay: () => void }) {
  const base = 6;
  const step = 2.6;
  const end = base + site.letter.length * step;

  return (
    <Chap
      deco={
        <>
          <div className="fadeaway">
            <Sparks cls="star" n={80} />
            <Sparks n={40} />
          </div>

          <div className="fog" />
        </>
      }
    >
      <Lines lines={site.finalIntro} start={0.5} step={2.2} />

      <div
        className="letter rv dimout"
        style={
          {
            ...T(3.5),
            "--letter-bg": `url("${site.finalPhoto}")`,
          } as React.CSSProperties
        }
      >
        {site.letter.map((paragraph, i) => (
          <p key={i} className="rv" style={T(base + i * step)}>
            {paragraph}
          </p>
        ))}
      </div>

      <Lines lines={site.finale} start={end + 1} step={3} big={0} />

      <button className="btn rv" style={T(end + 11)} onClick={replay}>
        <RotateCcw size={14} />
        REPLAY OUR STORY
      </button>
    </Chap>
  );
}

/* -------------------------------------------------------
   MAIN STORY EXPERIENCE
------------------------------------------------------- */

export default function StoryExperience() {
  const [ch, setCh] = useState(0);
  const [max, setMax] = useState(0);
  const [k, setK] = useState(0);

  /* visitor identity: the server is the source of truth (httpOnly cookie) */
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");

  /* on load, ask the server whether this browser is already a known visitor */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/visitor", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data?.known && typeof data.name === "string") {
            setName(data.name);
          }
        }
      } catch {
        /* offline or server error - the gate will simply ask */
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* create the visitor on the server; resolves to an error message or null */
  const saveName = async (n: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, website: "" }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.known) {
        setName(typeof data.name === "string" ? data.name : n);
        return null;
      }

      /* show the real reason instead of letting the story continue without a cookie */
      return data?.error ?? "Something went wrong. Please try again.";
    } catch {
      return "Couldn't reach the server. Check your connection and try again.";
    }
  };

  /* anonymous analytics: starts only once the visitor cookie exists */
  useAnalytics(ready && !!name, ch, k);

  const go = (n: number) => {
    setCh(n);
    setMax((m) => Math.max(m, n));
  };

  const next = () => {
    go(Math.min(ch + 1, 8));
  };

  const back = () => {
    if (ch > 0) go(ch - 1);
  };

  const replay = () => {
    setCh(0);
    setMax(0);
    setK((x) => x + 1);
  };

  /* wait for the server check so the gate does not flash */
  if (!ready) return <main className="root" />;

  /* first screen: ask for the name */
  if (!name) {
    return (
      <main className="root">
        <NameGate onSubmit={saveName} />
      </main>
    );
  }

  const views = [
    <Ch1 key="1" next={next} />,
    <Ch2 key="2" next={next} />,
    <Ch3 key="3" next={next} />,
    <Ch4 key="4" next={next} />,
    <Ch5 key="5" next={next} />,
    <Ch6 key="6" next={next} />,
    <Ch7 key="7" next={next} />,
    <Ch8 key="8" next={next} />,
    <Ch9 key="9" replay={replay} />,
  ];

  return (
    <main className="root">
      <header className="bar">
        <nav className="dots" aria-label="Chapters">
          {views.map((_, i) => (
            <button
              key={i}
              aria-label={`Chapter ${i + 1}`}
              disabled={i > max}
              onClick={() => go(i)}
              className={i === ch ? "on" : ""}
            />
          ))}
        </nav>

        <div className="flex gap-2">
          <button
            className="mini"
            onClick={back}
            disabled={ch === 0}
            style={{ opacity: ch === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* Skip jumps straight to the next chapter */}
          <button
            className="mini"
            onClick={next}
            disabled={ch === 8}
            style={{ opacity: ch === 8 ? 0.4 : 1 }}
          >
            <SkipForward size={14} />
            Skip
          </button>

          <button className="mini" onClick={replay}>
            <RotateCcw size={14} />
            Replay
          </button>
        </div>
      </header>

      <div key={`${k}-${ch}`} className="view">
        {views[ch]}
      </div>

      {/* feedback button appears on the final chapter, after the letter */}
      {ch === 8 && <FeedbackForm delay={24} />}

      {/* small privacy notice on the intro (a cookie is now used, so say so) */}
      {ch === 0 && (
        <p className="fb-notice">
          Only your first name and anonymous visit stats are saved · no email or location
        </p>
      )}
    </main>
  );
}