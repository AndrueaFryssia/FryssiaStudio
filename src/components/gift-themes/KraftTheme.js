// src/components/gift-themes/KraftTheme.js
// ─────────────────────────────────────────────────────────────
// MINIMALIST KRAFT — Paper texture, earthy #F5E6C8/#6B3F10
// Hand-drawn feel, serif Lora font
// Mini-game: Memory Match 3x2 grid
// Transition: Paper unfold reveal
// ─────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiftContent from "../gift-templates/Giftcontent";

export const KRAFT_THEME = {
  id: "kraft",
  name: "Kraft Paper",
  description: "Nuansa kertas vintage, earthy, hand-drawn feel",
  bg: "#F5E6C8",
  bgSecondary: "#EDD9A3",
  surface: "#FBF3E2",
  accent: "#6B3F10",
  accentAlt: "#A0652A",
  text: "#3D2B1A",
  textMuted: "#8B6F4A",
  border: "#6B3F10",
  fontDisplay: "'Lora', Georgia, serif",
  fontBody: "'Lora', Georgia, serif",
  bgStyle: {
    background: "#F5E6C8",
    // Paper fiber texture via SVG noise filter
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
  cardStyle: {
    background: "#FBF3E2",
    border: "2px solid #6B3F10",
    boxShadow: "5px 5px 0 rgba(107,63,16,0.25)",
  },
  btnStyle: {
    background: "#6B3F10",
    color: "#FBF3E2",
    border: "2px solid #3D2B1A",
    boxShadow: "4px 4px 0 #3D2B1A",
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 14,
    fontStyle: "italic",
    cursor: "pointer",
    letterSpacing: 0.5,
  },
  previewBg: "linear-gradient(135deg, #F5E6C8 0%, #EDD9A3 100%)",
  previewAccent: "#6B3F10",
  label: "KRAFT",
};

// ── Paper texture overlay ────────────────────────────────────
const PaperTexture = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
    }}
  />
);

// ── Hand-drawn underline SVG ─────────────────────────────────
const HandDrawnLine = ({ color = "#6B3F10", width = 80 }) => (
  <svg width={width} height={8} viewBox={`0 0 ${width} 8`} aria-hidden>
    <path
      d={`M2,5 Q${width * 0.25},2 ${width * 0.5},4 Q${width * 0.75},6 ${width - 2},3`}
      stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
      style={{ opacity: 0.6 }}
    />
  </svg>
);

// ── Decorative washi tape ─────────────────────────────────────
const WashiTape = ({ color = "#C4831A", rotate = -2, style = {} }) => (
  <div
    style={{
      background: color,
      opacity: 0.55,
      width: 64, height: 20,
      transform: `rotate(${rotate}deg)`,
      position: "absolute",
      ...style,
    }}
  />
);

// ─────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────
const KraftLanding = ({ data, onStart }) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
    style={KRAFT_THEME.bgStyle}
  >
    <PaperTexture />

    {/* Aged paper edges */}
    <div className="absolute top-0 left-0 right-0 h-4" style={{ background: "linear-gradient(180deg, rgba(107,63,16,0.12), transparent)" }} />
    <div className="absolute bottom-0 left-0 right-0 h-4" style={{ background: "linear-gradient(0deg, rgba(107,63,16,0.12), transparent)" }} />

    <div className="relative z-10 text-center max-w-sm w-full">
      {/* Letter/postcard style card */}
      <div
        className="relative px-7 py-9 mb-8"
        style={{ ...KRAFT_THEME.cardStyle, position: "relative" }}
      >
        {/* Washi tape corners */}
        <WashiTape color="#C4831A" rotate={-8} style={{ top: -8, left: -10 }} />
        <WashiTape color="#A0652A" rotate={5} style={{ top: -8, right: -10 }} />

        {/* Postage stamp decoration */}
        <div
          className="absolute top-3 right-3 w-9 h-11 flex items-center justify-center"
          style={{
            border: "2px solid #6B3F10",
            background: "#EDD9A3",
            boxShadow: "inset 0 0 0 2px #FBF3E2",
            opacity: 0.6,
          }}
        >
          <div style={{ width: 20, height: 20, background: "#6B3F10", opacity: 0.4 }} />
        </div>

        <p
          className="text-xs tracking-widest uppercase mb-4 text-left"
          style={{ fontFamily: KRAFT_THEME.fontBody, color: KRAFT_THEME.textMuted, fontSize: 10 }}
        >
          To,
        </p>
        <h1
          className="text-left mb-3"
          style={{
            fontFamily: KRAFT_THEME.fontDisplay,
            fontSize: "clamp(1.8rem, 7vw, 2.6rem)",
            color: KRAFT_THEME.text,
            lineHeight: 1.15,
            wordBreak: "break-word",
          }}
        >
          {data.recipient_name}
        </h1>
        <div className="text-left mb-5">
          <HandDrawnLine color="#6B3F10" width={100} />
        </div>
        <p
          className="text-xs italic text-right"
          style={{ fontFamily: KRAFT_THEME.fontBody, color: KRAFT_THEME.textMuted }}
        >
          — dari {data.sender_name}
        </p>
      </div>

      <button
        onPointerDown={onStart}
        className="w-full py-4 transition-all active:translate-y-0.5"
        style={{ ...KRAFT_THEME.btnStyle, display: "block" }}
      >
        Buka Surat
      </button>
      <p
        className="mt-4 text-xs italic"
        style={{ fontFamily: KRAFT_THEME.fontBody, color: KRAFT_THEME.textMuted }}
      >
        Ada puzzle kecil dulu ya...
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MINI GAME: MEMORY MATCH 3x2
// Kartu bergaya cork-board / pinned paper
// ─────────────────────────────────────────────────────────────
const SYMBOLS = ["A", "B", "C", "A", "B", "C"];

const MemoryMatchGame = ({ onComplete }) => {
  const buildDeck = useCallback(() =>
    SYMBOLS
      .map((sym, i) => ({ sym, uid: i, matched: false }))
      .sort(() => Math.random() - 0.5)
  , []);

  const [cards, setCards]     = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]);   // uids
  const [locked, setLocked]   = useState(false);
  const [moves, setMoves]     = useState(0);
  const [done, setDone]       = useState(false);

  const symbolColors = { A: "#F24C3D", B: "#6B3F10", C: "#C4831A" };
  const symbolLabels = { A: "★", B: "♦", C: "●" };

  const flip = (uid) => {
    const card = cards.find(c => c.uid === uid);
    if (locked || flipped.includes(uid) || card?.matched) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = next.map(u => cards.find(c => c.uid === u));
      if (a.sym === b.sym) {
        setTimeout(() => {
          setCards(prev => prev.map(c => next.includes(c.uid) ? { ...c, matched: true } : c));
          setFlipped([]);
          setLocked(false);
          const allMatched = cards.filter(c => !c.matched).length <= 2;
          if (allMatched) {
            setDone(true);
            setTimeout(onComplete, 1000);
          }
        }, 450);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  };

  const isFaceUp = (uid) => flipped.includes(uid) || cards.find(c => c.uid === uid)?.matched;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 relative"
      style={KRAFT_THEME.bgStyle}
    >
      <PaperTexture />

      <div className="relative z-10 text-center w-full max-w-sm">
        {/* Header */}
        <div
          className="inline-block px-5 py-2 mb-6"
          style={{ background: "#6B3F10", border: "2px solid #3D2B1A", boxShadow: "3px 3px 0 #3D2B1A" }}
        >
          <p
            className="text-xs italic"
            style={{ fontFamily: KRAFT_THEME.fontDisplay, color: "#FBF3E2" }}
          >
            Mini Game · Tebak Pasangan
          </p>
        </div>

        <p
          className="mb-6 text-sm"
          style={{ fontFamily: KRAFT_THEME.fontBody, color: KRAFT_THEME.textMuted, fontStyle: "italic" }}
        >
          Temukan 3 pasang kartu · {moves} langkah
        </p>

        {/* 3x2 card grid */}
        <div
          className="grid gap-3 mx-auto"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", maxWidth: 280 }}
        >
          {cards.map(card => {
            const faceUp = isFaceUp(card.uid);
            return (
              <motion.button
                key={card.uid}
                onPointerDown={() => flip(card.uid)}
                className="relative aspect-square flex items-center justify-center"
                style={{
                  background: faceUp ? (card.matched ? "#EDD9A3" : "#FBF3E2") : "#EDD9A3",
                  border: `2px solid ${faceUp ? symbolColors[card.sym] : "#A0652A"}`,
                  boxShadow: faceUp ? `4px 4px 0 ${symbolColors[card.sym]}55` : "3px 3px 0 #A0652A44",
                  cursor: faceUp ? "default" : "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                }}
                whileTap={!faceUp ? { scale: 0.92 } : {}}
              >
                {/* Washi tape pin on back */}
                {!faceUp && (
                  <div
                    className="absolute top-0 left-1/2"
                    style={{
                      width: 24, height: 8,
                      marginLeft: -12, marginTop: -4,
                      background: "#C4831A",
                      opacity: 0.6,
                      transform: `rotate(${(card.uid % 3 - 1) * 4}deg)`,
                    }}
                  />
                )}
                <AnimatePresence mode="wait">
                  {faceUp ? (
                    <motion.span
                      key="face"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontFamily: KRAFT_THEME.fontDisplay,
                        fontSize: 28,
                        color: symbolColors[card.sym],
                        fontWeight: 700,
                      }}
                    >
                      {symbolLabels[card.sym]}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="back"
                      style={{
                        fontFamily: KRAFT_THEME.fontBody,
                        fontSize: 18,
                        color: "#A0652A",
                        opacity: 0.5,
                      }}
                    >
                      ?
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {done && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-base italic"
            style={{ fontFamily: KRAFT_THEME.fontDisplay, color: "#6B3F10" }}
          >
            Berhasil! {moves} langkah.
          </motion.p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAPER UNFOLD TRANSITION
// ─────────────────────────────────────────────────────────────
const PaperUnfold = ({ onDone }) => {
  // Simple: a kraft-colored overlay that scales from top
  return (
    <motion.div
      className="fixed inset-0 z-50"
      style={{ background: "#F5E6C8", transformOrigin: "top" }}
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      onAnimationComplete={onDone}
    >
      <PaperTexture />
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{ background: "linear-gradient(90deg, #6B3F10, #A0652A, #6B3F10)", opacity: 0.3 }}
      />
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT: KRAFT THEME
// flow: landing → game → unfold → content
// ─────────────────────────────────────────────────────────────
const KraftTheme = ({ data }) => {
  const [phase, setPhase] = useState("landing");
  const [showUnfold, setShowUnfold] = useState(false);

  const handleGameDone = () => {
    setPhase("content");
    setShowUnfold(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <KraftLanding data={data} onStart={() => setPhase("game")} />
          </motion.div>
        )}
        {phase === "game" && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <MemoryMatchGame onComplete={handleGameDone} />
          </motion.div>
        )}
        {phase === "content" && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <GiftContent data={data} theme={KRAFT_THEME} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paper unfold overlay on top */}
      {showUnfold && <PaperUnfold onDone={() => setShowUnfold(false)} />}
    </>
  );
};

export default KraftTheme;