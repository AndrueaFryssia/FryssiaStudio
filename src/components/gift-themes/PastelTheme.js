// src/components/gift-themes/PastelTheme.js
// ─────────────────────────────────────────────────────────────
// PLAYFUL PASTEL — Bubbly, soft vibrant, 2D hard shadows
// Nunito font, rounded everything, candy colors
// Mini-game: Catch Falling Shapes (CSS circles/stars)
// Transition: Confetti burst + zoom in
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiftContent from "../gift-templates/Giftcontent";

export const PASTEL_THEME = {
  id: "pastel",
  name: "Playful Pastel",
  description: "Cerah, bubbly, fun! Warna pastel yang ceria",
  bg: "#F8F4FF",
  bgSecondary: "#EDE8FF",
  surface: "#FFFFFF",
  accent: "#7C4DFF",
  accentAlt: "#FF6B9D",
  text: "#1A1040",
  textMuted: "#7B6FA0",
  border: "#1A1040",
  fontDisplay: "'Nunito', 'Helvetica Neue', sans-serif",
  fontBody: "'Nunito', 'Helvetica Neue', sans-serif",
  bgStyle: {
    background: "linear-gradient(145deg, #F8F4FF 0%, #FFF0F7 50%, #F0F8FF 100%)",
  },
  cardStyle: {
    background: "#FFFFFF",
    border: "2.5px solid #1A1040",
    boxShadow: "6px 6px 0 #1A1040",
    borderRadius: 20,
  },
  btnStyle: {
    background: "#7C4DFF",
    color: "#fff",
    border: "2.5px solid #1A1040",
    boxShadow: "5px 5px 0 #1A1040",
    fontFamily: "'Nunito', sans-serif",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    borderRadius: 14,
  },
  previewBg: "linear-gradient(135deg, #EDE8FF 0%, #FFE0F0 50%, #E0F4FF 100%)",
  previewAccent: "#7C4DFF",
  label: "PASTEL",
};

const PASTEL_COLORS = ["#FF6B9D", "#7C4DFF", "#00BCD4", "#FFD600", "#FF7043", "#69F0AE"];
const PASTEL_SHAPES = ["circle", "star", "rounded"]; // rendered via CSS

// ── Confetti piece ────────────────────────────────────────────
const ConfettiPiece = ({ x, color, delay, size, shape }) => (
  <motion.div
    className="fixed pointer-events-none z-50"
    style={{
      left: `${x}vw`, top: -20, width: size, height: size,
      background: color,
      borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? 6 : 2,
      border: "1.5px solid rgba(0,0,0,0.15)",
    }}
    animate={{ y: "110vh", x: [0, (Math.random() - 0.5) * 80], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)], opacity: [1, 1, 0] }}
    transition={{ duration: 2.5 + Math.random() * 1.5, delay, ease: "linear" }}
  />
);

// ─────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────
const PastelLanding = ({ data, onStart }) => {
  const bubbles = Array.from({ length: 6 }, (_, i) => ({
    id: i, size: 40 + i * 15,
    color: PASTEL_COLORS[i],
    x: [10, 80, 25, 70, 15, 85][i],
    y: [15, 10, 85, 80, 50, 50][i],
  }));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={PASTEL_THEME.bgStyle}
    >
      {/* Floating pastel bubbles bg */}
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: b.size, height: b.size,
            background: b.color,
            opacity: 0.12,
            border: "2px solid rgba(0,0,0,0.06)",
          }}
          animate={{ scale: [1, 1.08, 1], y: [0, -12, 0] }}
          transition={{ duration: 4 + b.id * 0.7, repeat: Infinity, delay: b.id * 0.6 }}
        />
      ))}

      <div className="relative z-10 text-center max-w-xs w-full">
        {/* Big decorative circle */}
        <div className="flex justify-center gap-3 mb-6">
          {[24, 32, 24].map((s, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: s, height: s,
                background: PASTEL_COLORS[i * 2],
                border: "2.5px solid #1A1040",
                boxShadow: "3px 3px 0 #1A1040",
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Title card */}
        <div
          className="px-6 py-8 mb-7"
          style={{ ...PASTEL_THEME.cardStyle, position: "relative" }}
        >
          {/* Decorative sticker blobs */}
          <div
            className="absolute -top-4 -right-3 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "#FFD600", border: "2.5px solid #1A1040", boxShadow: "3px 3px 0 #1A1040" }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A1040" }} />
          </div>

          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ fontFamily: PASTEL_THEME.fontBody, color: PASTEL_THEME.textMuted, fontWeight: 700 }}
          >
            hadiah untuk
          </p>
          <h1
            className="mb-4"
            style={{
              fontFamily: PASTEL_THEME.fontDisplay,
              fontSize: "clamp(1.7rem, 8vw, 2.5rem)",
              color: PASTEL_THEME.text,
              fontWeight: 900,
              lineHeight: 1.1,
              wordBreak: "break-word",
            }}
          >
            {data.recipient_name}
          </h1>
          <div className="flex items-center justify-center gap-2 my-3">
            {PASTEL_COLORS.slice(0, 4).map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: c, border: "1.5px solid #1A1040" }} />
            ))}
          </div>
          <p
            className="text-xs"
            style={{ fontFamily: PASTEL_THEME.fontBody, color: PASTEL_THEME.textMuted, fontWeight: 600 }}
          >
            dari {data.sender_name}
          </p>
        </div>

        <button
          onPointerDown={onStart}
          className="w-full py-4 active:translate-y-0.5 transition-transform"
          style={{ ...PASTEL_THEME.btnStyle, display: "block" }}
        >
          Buka Hadiah!
        </button>
        <p
          className="mt-4 text-xs"
          style={{ fontFamily: PASTEL_THEME.fontBody, color: PASTEL_THEME.textMuted, fontWeight: 600 }}
        >
          Ada game seru dulu
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MINI GAME: CATCH FALLING SHAPES
// ─────────────────────────────────────────────────────────────
const CatchShapesGame = ({ onComplete }) => {
  const TARGET = 10;
  const [shapes, setShapes]   = useState([]);
  const [caught, setCaught]   = useState(0);
  const [pops, setPops]       = useState([]);
  const idRef                 = useRef(0);
  const intervalRef           = useRef();
  const isDoneRef             = useRef(false);

  const spawnShape = useCallback(() => {
    setShapes(prev => {
      if (prev.length > 12) return prev;
      const colorIdx = Math.floor(Math.random() * PASTEL_COLORS.length);
      return [...prev, {
        id: ++idRef.current,
        x: 5 + Math.random() * 83,
        size: 30 + Math.random() * 22,
        duration: 3 + Math.random() * 2,
        color: PASTEL_COLORS[colorIdx],
        shape: PASTEL_SHAPES[Math.floor(Math.random() * PASTEL_SHAPES.length)],
      }];
    });
  }, []);

  useEffect(() => {
    spawnShape();
    setTimeout(spawnShape, 350);
    intervalRef.current = setInterval(spawnShape, 800);
    return () => clearInterval(intervalRef.current);
  }, [spawnShape]);

  const catchShape = useCallback((id, e) => {
    if (isDoneRef.current) return;
    e.stopPropagation();
    setShapes(prev => prev.filter(s => s.id !== id));
    const rect = e.currentTarget.getBoundingClientRect();
    const pid = Date.now() + Math.random();
    setPops(prev => [...prev, { id: pid, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== pid)), 700);
    setCaught(c => {
      const next = c + 1;
      if (next >= TARGET) {
        isDoneRef.current = true;
        clearInterval(intervalRef.current);
        setTimeout(onComplete, 800);
      }
      return next;
    });
  }, [onComplete]);

  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      style={PASTEL_THEME.bgStyle}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-10 pb-3 px-5 text-center">
        <div
          className="inline-block px-4 py-2 mb-5"
          style={{
            ...PASTEL_THEME.cardStyle,
            padding: "8px 20px",
            display: "inline-block",
          }}
        >
          <p
            className="text-xs tracking-wider"
            style={{ fontFamily: PASTEL_THEME.fontBody, color: PASTEL_THEME.accent, fontWeight: 800 }}
          >
            MINI GAME
          </p>
        </div>
        <h2
          className="mb-2 block"
          style={{
            fontFamily: PASTEL_THEME.fontDisplay,
            fontSize: "clamp(1.4rem, 6vw, 2rem)",
            color: PASTEL_THEME.text,
            fontWeight: 900,
          }}
        >
          Tangkap Semuanya!
        </h2>

        {/* Colorful dot progress */}
        <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
          {Array.from({ length: TARGET }, (_, i) => (
            <motion.div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                background: i < caught ? PASTEL_COLORS[i % PASTEL_COLORS.length] : "#E0D8FF",
                border: "2px solid #1A1040",
                boxShadow: i < caught ? "2px 2px 0 #1A1040" : "none",
              }}
              animate={i < caught ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Falling shapes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {shapes.map(s => (
          <motion.button
            key={s.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${s.x}%`, top: -50,
              width: s.size, height: s.size,
              background: s.color,
              border: "2.5px solid #1A1040",
              boxShadow: "3px 3px 0 #1A1040",
              borderRadius: s.shape === "circle" ? "50%" : s.shape === "rounded" ? 10 : 4,
              touchAction: "none",
              cursor: "pointer",
            }}
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: "115vh", rotate: s.shape === "star" ? [0, 180, 360] : 0 }}
            transition={{ duration: s.duration, ease: "linear" }}
            onAnimationComplete={() => setShapes(p => p.filter(sh => sh.id !== s.id))}
            onPointerDown={(e) => catchShape(s.id, e)}
            whileTap={{ scale: 1.4 }}
          />
        ))}
      </div>

      {/* Pop bursts */}
      {pops.map(p => (
        <div key={p.id} className="fixed pointer-events-none z-50" style={{ left: p.x, top: p.y }}>
          {PASTEL_COLORS.slice(0, 5).map((color, i) => {
            const angle = (i / 5) * Math.PI * 2;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{ width: 8, height: 8, background: color, border: "1.5px solid #1A1040" }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * 28,
                  y: Math.sin(angle) * 28,
                  opacity: 0,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CONFETTI TRANSITION
// ─────────────────────────────────────────────────────────────
const ConfettiTransition = ({ onDone }) => {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: PASTEL_COLORS[i % PASTEL_COLORS.length],
    delay: Math.random() * 0.4,
    size: 8 + Math.random() * 8,
    shape: PASTEL_SHAPES[i % 3],
  }));

  useEffect(() => {
    setTimeout(onDone, 1200);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" style={{ background: "rgba(248,244,255,0.6)" }}>
      {pieces.map(p => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT: PASTEL THEME
// flow: landing → game → confetti burst → content
// ─────────────────────────────────────────────────────────────
const PastelTheme = ({ data }) => {
  const [phase, setPhase] = useState("landing");

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <PastelLanding data={data} onStart={() => setPhase("game")} />
          </motion.div>
        )}
        {phase === "game" && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <CatchShapesGame onComplete={() => setPhase("transition")} />
          </motion.div>
        )}
        {phase === "content" && (
          <motion.div key="content"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <GiftContent data={data} theme={PASTEL_THEME} />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "transition" && (
        <>
          <div style={{ position: "fixed", inset: 0 }}>
            <GiftContent data={data} theme={PASTEL_THEME} />
          </div>
          <ConfettiTransition onDone={() => setPhase("content")} />
        </>
      )}
    </>
  );
};

export default PastelTheme;
