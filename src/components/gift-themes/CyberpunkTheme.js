// src/components/gift-themes/CyberpunkTheme.js
// ─────────────────────────────────────────────────────────────
// CYBERPUNK NIGHT — dark, neon cyan #00E5FF & magenta #FF00AA
// Grid background, monospace, scan-line overlays
// Mini-game: Click Moving Button (hacker terminal style)
// Transition: Terminal boot sequence
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiftContent from "../gift-templates/Giftcontent";

export const CYBERPUNK_THEME = {
  id: "cyberpunk",
  name: "Cyberpunk Night",
  description: "Dark mode neon, grid cyber, tech futuristik",
  bg: "#080818",
  bgSecondary: "#0D0D1F",
  surface: "#0F0F28",
  accent: "#00E5FF",
  accentAlt: "#FF00AA",
  text: "#D0D0FF",
  textMuted: "#4040AA",
  border: "#00E5FF",
  fontDisplay: "'Share Tech Mono', 'Courier New', monospace",
  fontBody: "'Share Tech Mono', 'Courier New', monospace",
  bgStyle: {
    background: "#080818",
    backgroundImage: `
      linear-gradient(rgba(0,229,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.035) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
  },
  cardStyle: {
    background: "#0F0F28",
    border: "1px solid #00E5FF",
    boxShadow: "0 0 20px rgba(0,229,255,0.15), 0 0 60px rgba(255,0,170,0.06), inset 0 0 30px rgba(0,229,255,0.04)",
  },
  btnStyle: {
    background: "transparent",
    color: "#00E5FF",
    border: "1px solid #00E5FF",
    boxShadow: "0 0 12px rgba(0,229,255,0.5), inset 0 0 12px rgba(0,229,255,0.05)",
    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 3,
    cursor: "pointer",
    textTransform: "uppercase",
  },
  previewBg: "linear-gradient(135deg, #080818 0%, #0D0D1F 100%)",
  previewAccent: "#00E5FF",
  label: "CYBER",
};

// ── Shared scan-line overlay ──────────────────────────────────
const ScanLines = () => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,229,255,0.025) 3px, rgba(0,229,255,0.025) 4px)",
    }}
  />
);

// ── Neon corner brackets ──────────────────────────────────────
const NeonCorners = ({ color = "#00E5FF", size = 20 }) => (
  <>
    {[
      { top: 0, left: 0, borderRight: "none", borderBottom: "none" },
      { top: 0, right: 0, borderLeft: "none", borderBottom: "none" },
      { bottom: 0, left: 0, borderRight: "none", borderTop: "none" },
      { bottom: 0, right: 0, borderLeft: "none", borderTop: "none" },
    ].map((style, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          ...style,
          width: size, height: size,
          border: `2px solid ${color}`,
          ...style,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    ))}
  </>
);

// ── Terminal typewriter text ──────────────────────────────────
const TypewriterText = ({ text, speed = 40, style = {}, onDone }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); onDone && onDone(); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);
  return <span style={style}>{displayed}<span style={{ opacity: Math.sin(Date.now() / 300) > 0 ? 1 : 0 }}>_</span></span>;
};

// ─────────────────────────────────────────────────────────────
// TERMINAL BOOT TRANSITION
// ─────────────────────────────────────────────────────────────
const TerminalBoot = ({ onDone }) => {
  const lines = [
    "> DECRYPTING GIFT DATA...",
    "> ACCESS GRANTED",
    "> LOADING MEMORIES...",
    "> INITIALIZING DISPLAY...",
    "> READY",
  ];
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    lines.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), i * 350 + 100);
    });
    setTimeout(onDone, lines.length * 350 + 600);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center px-8"
      style={{ background: "#080818" }}
    >
      <ScanLines />
      <div className="relative">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-sm mb-2"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: i === visibleLines - 1 ? "#00E5FF" : "#4040AA",
              fontSize: 11,
              letterSpacing: 1,
              textShadow: i === visibleLines - 1 ? "0 0 10px #00E5FF" : "none",
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────
const CyberpunkLanding = ({ data, onStart }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-GB", { hour12: false }));
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false })), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden" style={CYBERPUNK_THEME.bgStyle}>
      <ScanLines />

      {/* HUD clock */}
      <div
        className="absolute top-4 right-4 text-xs font-mono"
        style={{ color: "#00E5FF", opacity: 0.6, letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}
      >
        {time}
      </div>
      <div
        className="absolute top-4 left-4 text-xs font-mono"
        style={{ color: "#FF00AA", opacity: 0.5, letterSpacing: 1 }}
      >
        SYS:GIFT-OS
      </div>

      <div className="relative z-10 text-center max-w-sm w-full">
        {/* Main terminal window */}
        <div
          className="relative px-6 py-7 mb-7"
          style={{ ...CYBERPUNK_THEME.cardStyle, position: "relative" }}
        >
          <NeonCorners color="#00E5FF" size={16} />
          <p
            className="text-[10px] tracking-widest mb-4 text-left"
            style={{ fontFamily: CYBERPUNK_THEME.fontBody, color: "#4040AA" }}
          >
            &gt; INCOMING TRANSMISSION
          </p>
          <p
            className="text-xs mb-1 tracking-wider"
            style={{ fontFamily: CYBERPUNK_THEME.fontBody, color: "#FF00AA", letterSpacing: 2 }}
          >
            RECIPIENT
          </p>
          <h1
            className="mb-4 leading-tight"
            style={{
              fontFamily: CYBERPUNK_THEME.fontDisplay,
              fontSize: "clamp(1.1rem, 5vw, 1.8rem)",
              color: "#00E5FF",
              textShadow: "0 0 20px rgba(0,229,255,0.6)",
              wordBreak: "break-word",
              letterSpacing: 2,
            }}
          >
            {data.recipient_name.toUpperCase()}
          </h1>
          <div
            className="w-full h-px mb-4"
            style={{ background: "linear-gradient(90deg, transparent, #00E5FF, transparent)", opacity: 0.4 }}
          />
          <p
            className="text-[10px]"
            style={{ fontFamily: CYBERPUNK_THEME.fontBody, color: "#4040AA", letterSpacing: 1 }}
          >
            FROM: {data.sender_name.toUpperCase()} &nbsp;·&nbsp; {data.title || "CLASSIFIED"}
          </p>
        </div>

        <button
          onPointerDown={onStart}
          className="w-full py-4 transition-all active:scale-95"
          style={{ ...CYBERPUNK_THEME.btnStyle, display: "block" }}
        >
          [ INITIALIZE SEQUENCE ]
        </button>

        <p
          className="mt-4 text-[9px] tracking-widest"
          style={{ fontFamily: CYBERPUNK_THEME.fontBody, color: "#2020AA" }}
        >
          WARNING: MINI GAME REQUIRED FOR ACCESS
        </p>
      </div>

      {/* Bottom grid accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, transparent, #00E5FF, #FF00AA, transparent)" }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MINI GAME: CLICK MOVING BUTTON (Cyberpunk terminal style)
// ─────────────────────────────────────────────────────────────
const CyberClickGame = ({ onComplete }) => {
  const CLICKS_NEEDED = 5;
  const [clicks, setClicks]   = useState(0);
  const [pos, setPos]          = useState({ x: 40, y: 45 });
  const [trails, setTrails]   = useState([]);
  const [done, setDone]       = useState(false);
  const isDoneRef              = useRef(false);

  const moveBtn = useCallback(() => {
    setPos({ x: 8 + Math.random() * 72, y: 28 + Math.random() * 46 });
  }, []);

  useEffect(() => { moveBtn(); }, [moveBtn]);

  const handleClick = useCallback((e) => {
    if (isDoneRef.current) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const tid = Date.now() + Math.random();
    setTrails(prev => [...prev, { id: tid, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
    setTimeout(() => setTrails(prev => prev.filter(t => t.id !== tid)), 700);
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

  return (
    <div className="min-h-screen relative overflow-hidden select-none" style={CYBERPUNK_THEME.bgStyle}>
      <ScanLines />

      <div className="absolute top-0 left-0 right-0 z-20 pt-10 pb-3 px-5 text-center">
        <div
          className="inline-block px-4 py-2 mb-5 text-[9px] tracking-widest"
          style={{
            fontFamily: CYBERPUNK_THEME.fontBody,
            border: "1px solid #FF00AA",
            color: "#FF00AA",
            boxShadow: "0 0 10px rgba(255,0,170,0.3)",
          }}
        >
          // MINI GAME //
        </div>
        <h2
          className="mb-2"
          style={{
            fontFamily: CYBERPUNK_THEME.fontDisplay,
            fontSize: "clamp(0.85rem, 4vw, 1.3rem)",
            color: "#00E5FF",
            textShadow: "0 0 15px rgba(0,229,255,0.5)",
            letterSpacing: 3,
          }}
        >
          TARGET ACQUIRED
        </h2>
        <p className="text-[9px] tracking-wider" style={{ color: "#4040AA", fontFamily: CYBERPUNK_THEME.fontBody }}>
          INTERCEPT {CLICKS_NEEDED} SIGNALS
        </p>

        {/* Neon progress bar */}
        <div
          className="w-48 h-1.5 mx-auto mt-4 overflow-hidden"
          style={{ background: "#0D0D1F", border: "1px solid #00E5FF33" }}
        >
          <motion.div
            className="h-full"
            style={{ background: "linear-gradient(90deg, #00E5FF, #FF00AA)" }}
            animate={{ width: `${(clicks / CLICKS_NEEDED) * 100}%` }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>
        <p className="text-[9px] mt-1" style={{ color: "#00E5FF", fontFamily: CYBERPUNK_THEME.fontBody, opacity: 0.6 }}>
          {clicks}/{CLICKS_NEEDED}
        </p>
      </div>

      {/* Moving button */}
      <motion.button
        className="absolute z-30 px-5 py-4"
        style={{
          left: `${pos.x}vw`, top: `${pos.y}vh`,
          transform: "translate(-50%, -50%)",
          touchAction: "none",
          userSelect: "none",
          minWidth: 110,
          ...CYBERPUNK_THEME.btnStyle,
        }}
        animate={{ left: `${pos.x}vw`, top: `${pos.y}vh` }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
        whileTap={{ scale: 0.9 }}
        onPointerDown={handleClick}
      >
        {done ? "ACCESS OK" : `[CLICK_${clicks + 1}]`}
      </motion.button>

      {/* Neon ripple on click */}
      {trails.map(t => (
        <motion.div
          key={t.id}
          className="fixed pointer-events-none z-40 rounded-full"
          style={{
            left: t.x, top: t.y,
            width: 40, height: 40,
            marginLeft: -20, marginTop: -20,
            border: "2px solid #00E5FF",
            boxShadow: "0 0 15px #00E5FF",
          }}
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FF00AA, #00E5FF, transparent)" }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT: CYBERPUNK THEME
// flow: landing → game → terminal boot → content
// ─────────────────────────────────────────────────────────────
const CyberpunkTheme = ({ data }) => {
  const [phase, setPhase] = useState("landing");

  return (
    <AnimatePresence mode="wait">
      {phase === "landing" && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <CyberpunkLanding data={data} onStart={() => setPhase("game")} />
        </motion.div>
      )}
      {phase === "game" && (
        <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <CyberClickGame onComplete={() => setPhase("boot")} />
        </motion.div>
      )}
      {phase === "boot" && (
        <TerminalBoot onDone={() => setPhase("content")} />
      )}
      {phase === "content" && (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <GiftContent data={data} theme={CYBERPUNK_THEME} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CyberpunkTheme; // FIX: p kecil sesuai deklarasi
