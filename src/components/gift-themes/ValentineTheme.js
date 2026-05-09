// src/components/gift-themes/ValentineTheme.js
// ─────────────────────────────────────────────────────────────
// VALENTINE — Elegant serif, pink/rose dominant, CSS hearts
// Mini-game: Catch Falling Shapes (CSS hearts, no emoji)
// Transition: Soft bloom / curtain reveal
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiftContent from "../gift-templates/Giftcontent";

export const VALENTINE_THEME = {
  id: "valentine",
  name: "Valentine",
  description: "Romantis, elegant, dominasi rose & pink lembut",
  bg: "#FFF0F5",
  bgSecondary: "#FFE0ED",
  surface: "#FFFFFF",
  accent: "#C9184A",
  accentAlt: "#FF85A1",
  text: "#2C1A22",
  textMuted: "#9B7285",
  border: "#C9184A",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody: "'Georgia', serif",
  bgStyle: {
    background: "linear-gradient(170deg, #FFF0F5 0%, #FFE0ED 40%, #FFD6E5 100%)",
  },
  cardStyle: {
    background: "rgba(255,255,255,0.95)",
    border: "1.5px solid #F4A0B5",
    boxShadow: "6px 6px 0 #F4A0B5",
  },
  btnStyle: {
    background: "#C9184A",
    color: "#fff",
    border: "1.5px solid #8B0028",
    boxShadow: "4px 4px 0 #8B0028",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 14,
    fontStyle: "italic",
    cursor: "pointer",
    letterSpacing: 0.5,
  },
  previewBg: "linear-gradient(135deg, #FFF0F5 0%, #FFD6E5 100%)",
  previewAccent: "#C9184A",
  label: "VALENTINE",
};

// ── CSS Heart SVG (no emoji, pure vector) ────────────────────
const HeartSVG = ({ size = 24, color = "#C9184A", opacity = 1 }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ opacity, display: "block" }}
    aria-hidden
  >
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

// ── Petal SVG ────────────────────────────────────────────────
const PetalSVG = ({ size = 16, color = "#FF85A1" }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 16 24" fill={color} aria-hidden>
    <ellipse cx="8" cy="12" rx="6" ry="11" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// FLOATING HEARTS BG — lightweight CSS-only, minimal count
// ─────────────────────────────────────────────────────────────
const FloatingHeartsBg = () => {
  const hearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + i * 11}%`,
    size: 8 + (i % 3) * 4,
    duration: 8 + i * 1.5,
    delay: i * 0.9,
    color: i % 2 === 0 ? "#F4A0B5" : "#FFB3C6",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map(h => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: h.left, top: "105%" }}
          animate={{ y: [0, "-120vh"], x: [0, (h.id % 2 === 0 ? 30 : -30), 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <HeartSVG size={h.size} color={h.color} />
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────
const ValentineLanding = ({ data, onStart }) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
    style={VALENTINE_THEME.bgStyle}
  >
    <FloatingHeartsBg />

    <div className="relative z-10 text-center max-w-sm w-full">
      {/* Decorative top hearts */}
      <div className="flex justify-center gap-3 mb-6">
        {[20, 28, 20].map((s, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          >
            <HeartSVG size={s} color={i === 1 ? "#C9184A" : "#F4A0B5"} />
          </motion.div>
        ))}
      </div>

      {/* Title card */}
      <div
        className="px-7 py-8 mb-7"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1.5px solid #F4A0B5",
          boxShadow: "8px 8px 0 #F4A0B5",
          backdropFilter: "blur(8px)",
        }}
      >
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: VALENTINE_THEME.fontBody, color: VALENTINE_THEME.textMuted }}
        >
          Sebuah hadiah untuk
        </p>
        <h1
          className="mb-2"
          style={{
            fontFamily: VALENTINE_THEME.fontDisplay,
            fontSize: "clamp(1.8rem, 8vw, 2.8rem)",
            color: VALENTINE_THEME.text,
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {data.recipient_name}
        </h1>
        <div className="flex items-center gap-2 justify-center my-3">
          <div style={{ flex: 1, height: 1, background: "#F4A0B5" }} />
          <HeartSVG size={10} color="#C9184A" />
          <div style={{ flex: 1, height: 1, background: "#F4A0B5" }} />
        </div>
        <p
          className="text-xs italic"
          style={{ fontFamily: VALENTINE_THEME.fontBody, color: VALENTINE_THEME.textMuted }}
        >
          dari {data.sender_name}
        </p>
      </div>

      <button
        onPointerDown={onStart}
        className="w-full py-4 transition-transform active:translate-y-0.5"
        style={{ ...VALENTINE_THEME.btnStyle, display: "block" }}
      >
        Buka Hadiahnya →
      </button>

      <p
        className="mt-5 text-xs italic"
        style={{ fontFamily: VALENTINE_THEME.fontBody, color: VALENTINE_THEME.textMuted }}
      >
        Ada mini game kecil dulu...
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MINI GAME: CATCH FALLING HEARTS (CSS, no emoji)
// ─────────────────────────────────────────────────────────────
const CatchHeartsGame = ({ onComplete }) => {
  const TARGET = 10;
  const [hearts, setHearts]   = useState([]);
  const [caught, setCaught]   = useState(0);
  const [blooms, setBlooms]   = useState([]);
  const idRef                 = useRef(0);
  const intervalRef           = useRef();
  const isDoneRef             = useRef(false);

  const spawnHeart = useCallback(() => {
    setHearts(prev => {
      if (prev.length > 10) return prev;
      return [...prev, {
        id: ++idRef.current,
        x: 5 + Math.random() * 83,
        size: 28 + Math.random() * 20,
        duration: 3.2 + Math.random() * 2,
        color: ["#C9184A", "#FF85A1", "#F4A0B5", "#FFB3C6"][Math.floor(Math.random() * 4)],
      }];
    });
  }, []);

  useEffect(() => {
    spawnHeart();
    setTimeout(spawnHeart, 400);
    intervalRef.current = setInterval(spawnHeart, 850);
    return () => clearInterval(intervalRef.current);
  }, [spawnHeart]);

  const catchHeart = useCallback((id, e) => {
    if (isDoneRef.current) return;
    e.stopPropagation();
    setHearts(prev => prev.filter(h => h.id !== id));
    const rect = e.currentTarget.getBoundingClientRect();
    const bid = Date.now() + Math.random();
    setBlooms(prev => [...prev, { id: bid, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
    setTimeout(() => setBlooms(prev => prev.filter(b => b.id !== bid)), 700);
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
      style={VALENTINE_THEME.bgStyle}
    >
      {/* Header */}
      <div className="relative z-20 pt-10 pb-3 px-5 text-center">
        <div
          className="inline-block px-4 py-2 mb-5 text-xs italic"
          style={{
            fontFamily: VALENTINE_THEME.fontDisplay,
            color: "#C9184A",
            border: "1px solid #F4A0B5",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(4px)",
          }}
        >
          ♡ Mini Game ♡
        </div>
        <h2
          className="mb-2"
          style={{
            fontFamily: VALENTINE_THEME.fontDisplay,
            fontSize: "clamp(1.4rem, 6vw, 2.2rem)",
            color: VALENTINE_THEME.text,
            lineHeight: 1.25,
          }}
        >
          Tangkap Hatinya
        </h2>
        <p
          className="text-sm"
          style={{ fontFamily: VALENTINE_THEME.fontBody, color: VALENTINE_THEME.textMuted }}
        >
          Tap {TARGET} hati sebelum jatuh
        </p>

        {/* Progress hearts */}
        <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
          {Array.from({ length: TARGET }, (_, i) => (
            <HeartSVG
              key={i}
              size={16}
              color={i < caught ? "#C9184A" : "#F4A0B5"}
              opacity={i < caught ? 1 : 0.35}
            />
          ))}
        </div>
      </div>

      {/* Falling hearts */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {hearts.map(h => (
          <motion.button
            key={h.id}
            className="absolute pointer-events-auto"
            style={{ left: `${h.x}%`, top: -40, touchAction: "none", background: "none", border: "none", padding: 4, cursor: "pointer" }}
            initial={{ y: 0, rotate: -10 }}
            animate={{ y: "115vh", rotate: 10 }}
            transition={{ duration: h.duration, ease: "linear" }}
            onAnimationComplete={() => setHearts(p => p.filter(i => i.id !== h.id))}
            onPointerDown={(e) => catchHeart(h.id, e)}
            whileTap={{ scale: 1.5 }}
          >
            <HeartSVG size={h.size} color={h.color} />
          </motion.button>
        ))}
      </div>

      {/* Bloom effects */}
      {blooms.map(b => (
        <div
          key={b.id}
          className="fixed pointer-events-none z-50"
          style={{ left: b.x, top: b.y, transform: "translate(-50%, -50%)" }}
        >
          {[0, 72, 144, 216, 288].map(deg => (
            <motion.div
              key={deg}
              className="absolute"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((deg * Math.PI) / 180) * 30,
                y: Math.sin((deg * Math.PI) / 180) * 30,
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <HeartSVG size={8} color="#C9184A" />
            </motion.div>
          ))}
        </div>
      ))}

      <FloatingHeartsBg />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT: VALENTINE THEME
// flow: landing → game → curtain → content
// ─────────────────────────────────────────────────────────────
const ValentineTheme = ({ data }) => {
  const [phase, setPhase] = useState("landing");

  const curtainVariants = {
    initial: { scaleY: 0, originY: 0 },
    animate: { scaleY: 1 },
    exit: { scaleY: 0, originY: 1 },
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "landing" && (
        <motion.div key="landing"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ValentineLanding data={data} onStart={() => setPhase("game")} />
        </motion.div>
      )}

      {phase === "game" && (
        <motion.div key="game"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <CatchHeartsGame onComplete={() => setPhase("content")} />
        </motion.div>
      )}

      {phase === "content" && (
        <motion.div key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <GiftContent data={data} theme={VALENTINE_THEME} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValentineTheme;