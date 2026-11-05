"use client";

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
   CHAPTER 2 - THE GIFT + BAT GAME
------------------------------------------------------- */

function Ch2({ next }: { next: () => void }) {
  const [open, setOpen] = useState(false);
  const [game, setGame] = useState(false);
  const [found, setFound] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);

  const total = batWords.length;
  const done = found.length === total;

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setGame(true), 1900);
    return () => clearTimeout(t);
  }, [open]);

  const catchBat = (i: number) => {
    if (found.includes(i)) return;
    setFound((f) => [...f, i]);
    setLast(i);
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
              Something is flying out of the box...
            </p>
          )}
        </>
      ) : (
        <div className="mission">
          <p className="mission-title rv">
            {done ? site.gift.surprise : "Catch the bats, Batman!"}
          </p>

          <p className="mission-description rv" style={T(0.3)}>
            {done
              ? "Every bat carried a word about you."
              : "Each bat is carrying a special word. Tap them before they fly away."}
          </p>

          <div className="game-area rv" style={T(0.5)}>
            {batWords.map((_, i) => (
              <button
                key={i}
                className={`game-bat ${found.includes(i) ? "caught" : ""}`}
                aria-label={`Catch bat ${i + 1}`}
                onClick={() => catchBat(i)}
                style={
                  {
                    left: `${8 + (r(i * 3 + 1) * 74) / 100}%`,
                    top: `${10 + (r(i * 5 + 2) * 62) / 100}%`,
                    "--dur": `${4 + (r(i + 9) % 40) / 10}s`,
                    "--x1": `${(r(i + 11) - 50) * 1.6}px`,
                    "--y1": `${(r(i + 21) - 50) * 1.2}px`,
                    "--x2": `${(r(i + 31) - 50) * 1.8}px`,
                    "--y2": `${(r(i + 41) - 50) * 1.2}px`,
                    "--x3": `${(r(i + 51) - 50) * 1.6}px`,
                    "--y3": `${(r(i + 61) - 50) * 1.2}px`,
                  } as React.CSSProperties
                }
              >
                <svg viewBox="0 0 100 60" width="56" height="34" aria-hidden="true">
                  <path d={BAT_PATH} fill="currentColor" />
                </svg>
              </button>
            ))}

            {last !== null && (
              <div key={last} className="game-word">
                <b>{batWords[last].word}</b>
                <span>{batWords[last].line}</span>
              </div>
            )}

            {!done && (
              <p className="game-hint">
                {found.length === 0
                  ? "Tap a bat…"
                  : `${total - found.length} more to go`}
              </p>
            )}
          </div>

          <div className="mission-progress">
            <Sparkles size={14} />
            {found.length} / {total} WORDS FOUND
          </div>

          {found.length > 0 && (
            <div className="word-chips">
              {found.map((i) => (
                <span key={i} className="word-chip">
                  {batWords[i].word}
                </span>
              ))}
            </div>
          )}

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
   CHAPTER 3 - MEMORIES WITH FLIP CARDS (grid, no slider)
------------------------------------------------------- */

function Ch3({ next }: { next: () => void }) {
  const [flipped, setFlipped] = useState<number[]>([]);

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
        {site.photos.map((memory, i) => (
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
          <Sparks cls="hidden" n={0} />
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
   CHAPTER 9 - FINAL LETTER (his photo + photo background)
------------------------------------------------------- */

function Ch9({ replay }: { replay: () => void }) {
  const base = 8;
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

      <div className="final-photo rv" style={T(3.8)}>
        <img src={site.finalPhoto} alt={site.name} />
      </div>

      <div
        className="letter rv dimout"
        style={
          {
            ...T(5),
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
  const [skip, setSkip] = useState(false);
  const [k, setK] = useState(0);

  const go = (n: number) => {
    setCh(n);
    setMax((m) => Math.max(m, n));
    setSkip(false);
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
    setSkip(false);
    setK((x) => x + 1);
  };

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
    <main className={`root ${skip ? "skip" : ""}`}>
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

          <button className="mini" onClick={() => setSkip(true)}>
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
    </main>
  );
}