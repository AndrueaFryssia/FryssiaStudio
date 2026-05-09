// src/components/gift-themes/PixelTheme.js
// ─────────────────────────────────────────────────────────────
// RETRO PIXEL — Japanese Coffee Shop vibe
// Palette: Cream #F2EAD3 · Soft Brown #3F2305 · Brick Red #F24C3D
// Font: Press Start 2P
// Mini-game: Click the Moving Button
// Transition: Screen glitch → fade-to-black → content
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiftContent from "../gift-templates/Giftcontent";
import PhotoGallery from "../gift-templates/PhotoGallery";

// ── Design tokens ─────────────────────────────────────────────
export const PIXEL_THEME = {
  id: "pixel",
  name: "Retro Pixel",
  description: "Nuansa coffee shop retro Jepang, cozy dan vintage",
  bg: "#F2EAD3",
  bgSecondary: "#E8DBBF",
  surface: "#FBF5E6",
  accent: "#F24C3D",
  accentAlt: "#C4831A",
  text: "#3F2305",
  textMuted: "#8B6914",
  border: "#3F2305",
  fontDisplay: "'Press Start 2P', monospace",
  fontBody: "'Press Start 2P', monospace",
  bgStyle: {
    background: "#F2EAD3",
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(242,76,61,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(196,131,26,0.08) 0%, transparent 50%)
    `,
  },
  cardStyle: {
    background: "#FBF5E6",
    border: "3px solid #3F2305",
    boxShadow: "5px 5px 0 #3F2305",
  },
  btnStyle: {
    background: "#F24C3D",
    color: "#FBF5E6",
    border: "3px solid #3F2305",
    boxShadow: "4px 4px 0 #3F2305",
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 9,
    letterSpacing: 0.5,
    cursor: "pointer",
    lineHeight: 1.6,
  },
  previewBg: "linear-gradient(135deg, #F2EAD3 0%, #E8DBBF 100%)",
  previewAccent: "#F24C3D",
  label: "PIXEL",
};

// ─────────────────────────────────────────────────────────────
// PIXEL DECORATIONS — reusable SVG components
// ─────────────────────────────────────────────────────────────
const PixelStar = ({ size = 8, color = "#F24C3D", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 8 8" style={style} aria-hidden>
    <rect x="3" y="0" width="2" height="2" fill={color} />
    <rect x="3" y="6" width="2" height="2" fill={color} />
    <rect x="0" y="3" width="2" height="2" fill={color} />
    <rect x="6" y="3" width="2" height="2" fill={color} />
    <rect x="3" y="3" width="2" height="2" fill={color} />
    <rect x="2" y="2" width="2" height="2" fill={color} />
    <rect x="4" y="2" width="2" height="2" fill={color} />
    <rect x="2" y="4" width="2" height="2" fill={color} />
    <rect x="4" y="4" width="2" height="2" fill={color} />
  </svg>
);

const PixelBorder = ({ color = "#3F2305" }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `
        linear-gradient(${color} 1px, transparent 1px),
        linear-gradient(90deg, ${color} 1px, transparent 1px)
      `,
      backgroundSize: "8px 8px",
      opacity: 0.04,
    }}
  />
);

const PixelDivider = () => (
  <div className="flex items-center gap-2 my-2">
    <div className="flex-1 h-px" style={{ background: "#3F2305", opacity: 0.25 }} />
    <PixelStar size={8} color="#F24C3D" />
    <div className="flex-1 h-px" style={{ background: "#3F2305", opacity: 0.25 }} />
  </div>
);

// ─────────────────────────────────────────────────────────────
// GLITCH TRANSITION — screen-glitch effect then fade to black
// ─────────────────────────────────────────────────────────────
const GlitchTransition = ({ onDone }) => {
  const [frame, setFrame] = useState(0);
  // frames: 0=glitch1, 1=glitch2, 2=black, 3=done
  useEffect(() => {
    const timings = [0, 120, 280, 500, 720, 900];
    const timers = timings.map((t, i) =>
      setTimeout(() => setFrame(i), t)
    );
    const final = setTimeout(onDone, 1100);
    return () => { timers.forEach(clearTimeout); clearTimeout(final); };
  }, [onDone]);

  const glitchLines = Array.from({ length: 6 }, (_, i) => ({
    top: `${10 + i * 14}%`,
    height: `${4 + Math.random() * 8}px`,
    left: `${Math.random() * 30}%`,
    width: `${40 + Math.random() * 60}%`,
    color: i % 2 === 0 ? "#F24C3D" : "#C4831A",
  }));

  if (frame >= 3) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: frame >= 2 ? "#000" : "#F2EAD3" }}
    >
      {frame < 2 && (
        <>
          {/* Scan lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(63,35,5,0.08) 3px, rgba(63,35,5,0.08) 4px)",
            }}
          />
          {/* Glitch slices */}
          {glitchLines.map((l, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: l.top, left: l.left,
                width: l.width, height: l.height,
                background: l.color,
                opacity: 0.7,
                transform: `translateX(${frame === 1 ? "-4px" : "4px"})`,
              }}
            />
          ))}
          {/* Pixel noise blocks */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 8, height: 8,
                background: i % 3 === 0 ? "#F24C3D" : i % 3 === 1 ? "#3F2305" : "#C4831A",
                opacity: 0.6,
              }}
            />
          ))}
          <p
            className="absolute bottom-8 left-0 right-0 text-center"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#F24C3D" }}
          >
            LOADING...
          </p>
        </>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// MINI GAME: CLICK THE MOVING BUTTON (Pixel style)
// ─────────────────────────────────────────────────────────────
const PixelClickGame = ({ onComplete }) => {
  const CLICKS_NEEDED = 5;
  const [clicks, setClicks]   = useState(0);
  const [pos, setPos]         = useState({ x: 35, y: 40 });
  const [flashes, setFlashes] = useState([]);
  const [done, setDone]       = useState(false);
  const isDoneRef             = useRef(false);

  const moveBtn = useCallback(() => {
    // Keep button within safe mobile viewport bounds
    setPos({
      x: 8 + Math.random() * 70,
      y: 28 + Math.random() * 44,
    });
  }, []);

  const labels = [
    "KLIK AKU!",
    "TANGKAP!",
    "LAGI!",
    "HAMPIR!",
    "TERAKHIR!",
  ];

  const handleClick = useCallback((e) => {
    if (isDoneRef.current) return;
    e.stopPropagation();
    const fid = Date.now() + Math.random();
    const rect = e.currentTarget.getBoundingClientRect();
    setFlashes(prev => [...prev, { id: fid, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
    setTimeout(() => setFlashes(p => p.filter(f => f.id !== fid)), 600);
    setClicks(c => {
      const next = c + 1;
      if (next >= CLICKS_NEEDED) {
        isDoneRef.current = true;
        setDone(true);
        setTimeout(onComplete, 900);
      } else {
        moveBtn();
      }
      return next;
    });
  }, [moveBtn, onComplete]);

  useEffect(() => { moveBtn(); }, [moveBtn]);

  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      style={{
        background: "#F2EAD3",
        backgroundImage: `
          radial-gradient(circle at 15% 85%, rgba(242,76,61,0.08) 0%, transparent 45%),
          radial-gradient(circle at 85% 15%, rgba(196,131,26,0.1) 0%, transparent 45%)
        `,
      }}
    >
      <PixelBorder />

      {/* Decorative pixel art corners */}
      {[
        { top: 12, left: 12 }, { top: 12, right: 12 },
        { bottom: 12, left: 12 }, { bottom: 12, right: 12 },
      ].map((pos, i) => (
        <div key={i} className="absolute" style={pos}>
          <PixelStar size={16} color="#3F2305" />
        </div>
      ))}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 pt-10 pb-4 px-5 text-center z-10">
        {/* Cafe-style badge */}
        <div
          className="inline-block px-4 py-2 mb-5"
          style={{
            background: "#3F2305",
            border: "2px solid #3F2305",
            boxShadow: "3px 3px 0 #F24C3D",
          }}
        >
          <p
            className="text-[8px] tracking-widest"
            style={{ fontFamily: "'Press Start 2P', monospace", color: "#F2EAD3" }}
          >
            ★ MINI GAME ★
          </p>
        </div>

        <h2
          className="leading-loose mb-3"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(0.7rem, 3.5vw, 1rem)",
            color: "#3F2305",
            lineHeight: 2,
          }}
        >
          TANGKAP<br />TOMBOLNYA!
        </h2>

        {/* Pixel progress dots */}
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: CLICKS_NEEDED }, (_, i) => (
            <div
              key={i}
              className="w-4 h-4"
              style={{
                background: i < clicks ? "#F24C3D" : "#E8DBBF",
                border: "2px solid #3F2305",
                boxShadow: i < clicks ? "2px 2px 0 #3F2305" : "none",
                transition: "background 0.15s",
              }}
            />
          ))}
        </div>
      </div>

      {/* The moving button */}
      <motion.button
        className="absolute z-30"
        style={{
          left: `${pos.x}vw`,
          top: `${pos.y}vh`,
          transform: "translate(-50%, -50%)",
          touchAction: "none",
          userSelect: "none",
          padding: "12px 16px",
          minWidth: 90,
          ...PIXEL_THEME.btnStyle,
        }}
        animate={{ left: `${pos.x}vw`, top: `${pos.y}vh` }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        whileTap={{ scale: 0.88 }}
        onPointerDown={handleClick}
      >
        {done ? "DONE!" : labels[Math.min(clicks, labels.length - 1)]}
      </motion.button>

      {/* Flash rings on click */}
      {flashes.map(f => (
        <motion.div
          key={f.id}
          className="fixed z-40 pointer-events-none"
          style={{
            left: f.x, top: f.y,
            width: 32, height: 32,
            marginLeft: -16, marginTop: -16,
            border: "3px solid #F24C3D",
            background: "transparent",
          }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ))}

      {/* Pixel art bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                height: i % 3 === 0 ? 12 : i % 3 === 1 ? 8 : 16,
                background: i % 2 === 0 ? "#3F2305" : "#F24C3D",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PIXEL LANDING — shown before mini game (theme preview)
// ─────────────────────────────────────────────────────────────
const PixelLanding = ({ data, onStart }) => {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{
        background: "#F2EAD3",
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(242,76,61,0.07) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(196,131,26,0.09) 0%, transparent 50%)
        `,
      }}
    >
      <PixelBorder />

      {/* Top pixel bar */}
      <div className="absolute top-0 left-0 right-0 h-3 flex">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? "#3F2305" : "#F24C3D" }} />
        ))}
      </div>

      {/* Corner decorations */}
      {[
        { top: 20, left: 16 }, { top: 20, right: 16 },
        { bottom: 20, left: 16 }, { bottom: 20, right: 16 },
      ].map((s, i) => (
        <PixelStar key={i} size={20} color="#C4831A" style={{ position: "absolute", ...s }} />
      ))}

      <div className="text-center max-w-xs w-full z-10">
        {/* Cafe signboard */}
        <div
          className="mx-auto mb-8 px-5 py-4 relative"
          style={{
            background: "#3F2305",
            border: "3px solid #3F2305",
            boxShadow: "6px 6px 0 #F24C3D",
            maxWidth: 280,
          }}
        >
          <p
            className="text-[7px] tracking-widest mb-2"
            style={{ fontFamily: "'Press Start 2P', monospace", color: "#C4831A" }}
          >
            ★ A GIFT FOR ★
          </p>
          <h1
            className="leading-loose"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(0.75rem, 4vw, 1.1rem)",
              color: "#F2EAD3",
              wordBreak: "break-word",
              lineHeight: 2,
            }}
          >
            {data.recipient_name}
          </h1>
          <PixelDivider />
          <p
            className="text-[7px]"
            style={{ fontFamily: "'Press Start 2P', monospace", color: "#E8DBBF", opacity: 0.7 }}
          >
            FROM: {data.sender_name}
          </p>
        </div>

        {/* Press start prompt */}
        <motion.div
          animate={{ opacity: blink ? 1 : 0 }}
          transition={{ duration: 0 }}
        >
          <p
            className="text-[8px] mb-6"
            style={{ fontFamily: "'Press Start 2P', monospace", color: "#3F2305" }}
          >
            ▼ PRESS START ▼
          </p>
        </motion.div>

        <button
          onPointerDown={onStart}
          style={{
            ...PIXEL_THEME.btnStyle,
            padding: "14px 28px",
            display: "block",
            width: "100%",
            maxWidth: 220,
            margin: "0 auto",
          }}
        >
          START GAME
        </button>

        <p
          className="mt-6 text-[7px] opacity-40"
          style={{ fontFamily: "'Press Start 2P', monospace", color: "#3F2305" }}
        >
          {data.title || "A special message awaits"}
        </p>
      </div>

      {/* Bottom pixel bar */}
      <div className="absolute bottom-0 left-0 right-0 h-3 flex">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? "#F24C3D" : "#3F2305" }} />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PIXEL CONTENT WRAPPER — wraps GiftContent with pixel styling
// ─────────────────────────────────────────────────────────────
const PixelContentWrapper = ({ data }) => (
  <div
    className="min-h-screen"
    style={{
      background: "#F2EAD3",
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(242,76,61,0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(196,131,26,0.08) 0%, transparent 50%)
      `,
    }}
  >
    <PixelBorder />
    {/* Top bar */}
    <div className="h-3 flex sticky top-0 z-20">
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? "#3F2305" : "#F24C3D" }} />
      ))}
    </div>
    <div className="relative z-10">
      <GiftContent data={data} theme={PIXEL_THEME} />
    </div>
    <div className="h-3 flex">
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? "#F24C3D" : "#3F2305" }} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT: PIXEL THEME ORCHESTRATOR
// flow: landing → game → glitch → content
// ─────────────────────────────────────────────────────────────
const PixelTheme = ({ data }) => {
  // phase: "landing" | "game" | "glitch" | "content"
  const [phase, setPhase] = useState("landing");

  return (
    <AnimatePresence mode="wait">
      {phase === "landing" && (
        <motion.div key="landing"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PixelLanding data={data} onStart={() => setPhase("game")} />
        </motion.div>
      )}

      {phase === "game" && (
        <motion.div key="game"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <PixelClickGame onComplete={() => setPhase("glitch")} />
        </motion.div>
      )}

      {phase === "glitch" && (
        <GlitchTransition onDone={() => setPhase("content")} />
      )}

      {phase === "content" && (
        <motion.div key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <PixelContentWrapper data={data} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PixelTheme;