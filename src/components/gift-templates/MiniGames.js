// src/components/gift-templates/MiniGames.js
// ─────────────────────────────────────────────────────────────
// 3 mini games yang dipilih otomatis berdasarkan theme.
// Semua game: mobile-first, touch-friendly, zero heavy emoji.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// GAME 1: CATCH GAME  (Valentine, Pastel)
// Shapes jatuh dari atas, user tap untuk tangkap.
// Pakai CSS shapes, bukan emoji.
// ─────────────────────────────────────────────────────────────
export const CatchGame = ({ theme, onComplete, targetCount = 10 }) => {
  const [items, setItems]         = useState([]);
  const [caught, setCaught]       = useState(0);
  const [sparks, setSparks]       = useState([]);
  const intervalRef               = useRef();
  const idRef                     = useRef(0);
  const isDone                    = useRef(false);

  const spawnItem = useCallback(() => {
    setItems(prev => {
      if (prev.length > 12) return prev; // cap concurrent items
      return [...prev, {
        id: ++idRef.current,
        x: 6 + Math.random() * 82,       // vw, keep away from edges
        duration: 3.5 + Math.random() * 2,
        size: 22 + Math.random() * 16,
        variant: Math.floor(Math.random() * 3), // shape variant
      }];
    });
  }, []);

  useEffect(() => {
    const t1 = setTimeout(spawnItem, 100);
    const t2 = setTimeout(spawnItem, 600);
    intervalRef.current = setInterval(spawnItem, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(intervalRef.current); };
  }, [spawnItem]);

  const catchItem = (id, clientX, clientY) => {
    if (isDone.current) return;
    setItems(prev => prev.filter(i => i.id !== id));
    const pid = Date.now() + Math.random();
    setSparks(prev => [...prev, { id: pid, x: clientX, y: clientY }]);
    setTimeout(() => setSparks(prev => prev.filter(s => s.id !== pid)), 700);
    setCaught(c => {
      const next = c + 1;
      if (next >= targetCount) {
        isDone.current = true;
        clearInterval(intervalRef.current);
        setTimeout(onComplete, 800);
      }
      return next;
    });
  };

  const handleTap = (id, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    catchItem(id, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  // CSS shape berdasarkan theme
  const getShape = (item) => {
    const base = {
      width: item.size,
      height: item.size,
      background: theme.accent,
    };
    if (theme.id === "valentine") {
      // Heart via CSS clip-path
      return (
        <div style={{
          ...base,
          background: [theme.accent, theme.accentAlt, "#FF85A1"][item.variant],
          clipPath: "polygon(50% 15%, 85% 0%, 100% 35%, 100% 65%, 50% 100%, 0% 65%, 0% 35%, 15% 0%)",
          borderRadius: "50% 50% 40% 40%",
        }} />
      );
    }
    if (theme.id === "pastel") {
      const colors = ["#FF6E91","#7C4DFF","#00BCD4","#FFD600"];
      return (
        <div style={{
          ...base,
          background: colors[item.variant % colors.length],
          borderRadius: item.variant === 0 ? "50%" : item.variant === 1 ? "30%" : 4,
          border: "2px solid #1A1A2E",
        }} />
      );
    }
    // Default: circle
    return <div style={{ ...base, borderRadius: "50%", border: `2px solid ${theme.border}` }} />;
  };

  const progress = Math.min(caught / targetCount, 1);

  return (
    <div className="min-h-screen relative overflow-hidden select-none" style={theme.bgStyle}>
      {/* Header */}
      <div className="relative z-20 pt-10 pb-4 px-5 text-center">
        <div
          className="inline-block text-xs font-mono px-3 py-1 mb-4 tracking-widest"
          style={{ background: theme.accent, color: theme.bg, border: `1px solid ${theme.border}` }}
        >
          MINI GAME
        </div>
        <h2
          className="text-3xl sm:text-4xl mb-2 leading-tight"
          style={{ fontFamily: theme.fontDisplay, color: theme.text }}
        >
          {theme.id === "valentine" ? "Tangkap Semuanya" : "Catch!"}
        </h2>
        <p className="text-sm" style={{ fontFamily: theme.fontBody, color: theme.textMuted }}>
          Tap {targetCount} item sebelum jatuh
        </p>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div
            className="w-36 h-3 overflow-hidden"
            style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}` }}
          >
            <motion.div
              className="h-full"
              style={{ background: theme.accent }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          <motion.span
            key={caught}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontFamily: theme.fontBody, color: theme.accent, fontSize: 16, fontWeight: 700 }}
          >
            {caught}/{targetCount}
          </motion.span>
        </div>
      </div>

      {/* Falling items */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {items.map(item => (
          <motion.button
            key={item.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{ left: `${item.x}%`, top: -40, touchAction: "none" }}
            initial={{ y: 0 }}
            animate={{ y: "110vh" }}
            transition={{ duration: item.duration, ease: "linear" }}
            onAnimationComplete={() => setItems(prev => prev.filter(i => i.id !== item.id))}
            onPointerDown={(e) => handleTap(item.id, e)}
            whileTap={{ scale: 1.4 }}
          >
            {getShape(item)}
          </motion.button>
        ))}
      </div>

      {/* Spark bursts */}
      {sparks.map(s => (
        <div
          key={s.id}
          className="fixed pointer-events-none z-50"
          style={{ left: s.x, top: s.y, transform: "translate(-50%, -50%)" }}
        >
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <motion.div
              key={deg}
              className="absolute w-2 h-2 rounded-full"
              style={{ background: theme.accent }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((deg * Math.PI) / 180) * 28,
                y: Math.sin((deg * Math.PI) / 180) * 28,
                opacity: 0,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>
      ))}

      <p
        className="absolute bottom-8 left-0 right-0 text-center text-xs"
        style={{ fontFamily: theme.fontBody, color: theme.textMuted }}
      >
        Sentuh item yang jatuh
      </p>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// GAME 2: MEMORY MATCH 2x2  (Valentine letter, Anniversary)
// 4 kartu, 2 pasang. Cepat & simpel.
// ─────────────────────────────────────────────────────────────
export const MemoryGame = ({ theme, onComplete }) => {
  const PAIRS = [
    { id: 0, symbol: "A", color: theme.accent },
    { id: 1, symbol: "B", color: theme.accentAlt },
  ];

  const buildDeck = () =>
    [...PAIRS, ...PAIRS]
      .map((p, i) => ({ ...p, uid: i, matched: false }))
      .sort(() => Math.random() - 0.5);

  const [cards, setCards]   = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves]   = useState(0);
  const [locked, setLocked] = useState(false);
  const [done, setDone]     = useState(false);

  const flip = (uid) => {
    if (locked || flipped.includes(uid) || cards.find(c => c.uid === uid)?.matched) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = next.map(u => cards.find(c => c.uid === u));
      if (a.id === b.id) {
        setTimeout(() => {
          setCards(prev => prev.map(c => next.includes(c.uid) ? { ...c, matched: true } : c));
          setFlipped([]);
          setLocked(false);
          const allDone = cards.filter(c => !c.matched).length <= 2;
          if (allDone) {
            setDone(true);
            setTimeout(onComplete, 1000);
          }
        }, 400);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  };

  const isFaceUp = (uid) => flipped.includes(uid) || cards.find(c => c.uid === uid)?.matched;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={theme.bgStyle}
    >
      <div
        className="inline-block text-xs font-mono px-3 py-1 mb-6 tracking-widest"
        style={{ background: theme.accent, color: theme.bg }}
      >
        MINI GAME
      </div>
      <h2
        className="text-3xl sm:text-4xl mb-2 text-center"
        style={{ fontFamily: theme.fontDisplay, color: theme.text }}
      >
        Tebak Pasangan
      </h2>
      <p className="text-sm mb-10 text-center" style={{ fontFamily: theme.fontBody, color: theme.textMuted }}>
        Temukan 2 pasang kartu · {moves} langkah
      </p>

      <div className="grid grid-cols-2 gap-4" style={{ width: "min(260px, 85vw)" }}>
        {cards.map(card => {
          const faceUp = isFaceUp(card.uid);
          return (
            <motion.button
              key={card.uid}
              onPointerDown={() => flip(card.uid)}
              className="relative aspect-square rounded-lg overflow-hidden"
              style={{
                ...theme.cardStyle,
                background: faceUp ? card.color : theme.surface,
                border: `2px solid ${faceUp ? card.color : theme.border}`,
                cursor: faceUp ? "default" : "pointer",
                boxShadow: card.matched
                  ? `0 0 16px ${card.color}88`
                  : theme.cardStyle.boxShadow,
              }}
              whileTap={!faceUp ? { scale: 0.92 } : {}}
              animate={{
                rotateY: faceUp ? 0 : 180,
                opacity: card.matched ? 0.7 : 1,
              }}
              transition={{ duration: 0.25 }}
            >
              <AnimatePresence>
                {faceUp && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      fontFamily: theme.fontDisplay,
                      fontSize: 32,
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {card.symbol}
                    {card.matched && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center text-sm"
                        style={{ background: "rgba(0,0,0,0.25)", color: "#fff" }}
                      >
                        OK
                      </motion.span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
              {!faceUp && (
                <div
                  className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                  style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
                >
                  ?
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-lg"
          style={{ fontFamily: theme.fontDisplay, color: theme.accent }}
        >
          Match! {moves} langkah
        </motion.p>
      )}
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// GAME 3: CLICK THE MOVING BUTTON  (Pixel, Cyberpunk, Kraft)
// Button bergerak acak, klik 5x untuk menang.
// ─────────────────────────────────────────────────────────────
export const ClickGame = ({ theme, onComplete, clicksNeeded = 5 }) => {
  const [clicks, setClicks]   = useState(0);
  const [pos, setPos]         = useState({ x: 40, y: 40 });
  const [flashes, setFlashes] = useState([]);
  const isDone                = useRef(false);

  const moveButton = useCallback(() => {
    setPos({
      x: 5 + Math.random() * 75,  // vw (keep button in frame)
      y: 25 + Math.random() * 50, // vh (avoid header/footer)
    });
  }, []);

  useEffect(() => { moveButton(); }, [moveButton]);

  const handleClick = (e) => {
    if (isDone.current) return;
    e.stopPropagation();
    moveButton();
    const fid = Date.now();
    setFlashes(prev => [...prev, { id: fid, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setFlashes(prev => prev.filter(f => f.id !== fid)), 500);
    setClicks(c => {
      const next = c + 1;
      if (next >= clicksNeeded) {
        isDone.current = true;
        setTimeout(onComplete, 700);
      }
      return next;
    });
  };

  const progress = Math.min(clicks / clicksNeeded, 1);
  const labels = ["Klik aku!", "Lagi!", "Terus!", "Hampir!", "Satu lagi!"];

  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      style={theme.bgStyle}
    >
      {/* Cyberpunk: scanline overlay */}
      {theme.id === "cyberpunk" && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,229,255,0.03) 3px, rgba(0,229,255,0.03) 4px)",
          }}
        />
      )}

      {/* Header */}
      <div className="relative z-20 pt-10 pb-4 px-5 text-center">
        <div
          className="inline-block text-xs font-mono px-3 py-1 mb-4 tracking-widest"
          style={{ background: theme.accent, color: theme.bg }}
        >
          MINI GAME
        </div>
        <h2
          className="text-3xl sm:text-4xl mb-2"
          style={{ fontFamily: theme.fontDisplay, color: theme.text }}
        >
          {theme.id === "pixel" ? "CATCH ME" : "Klik Aku"}
        </h2>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: clicksNeeded }, (_, i) => (
            <motion.div
              key={i}
              className="w-4 h-4"
              style={{
                background: i < clicks ? theme.accent : "transparent",
                border: `2px solid ${theme.accent}`,
                borderRadius: theme.id === "pastel" ? "50%" : 2,
                boxShadow: i < clicks ? `0 0 8px ${theme.accent}` : "none",
              }}
              animate={i < clicks ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Moving button */}
      <motion.button
        className="absolute z-30 font-mono text-sm px-6 py-4 tracking-wider cursor-pointer"
        style={{
          ...theme.btnStyle,
          left: `${pos.x}vw`,
          top: `${pos.y}vh`,
          transform: "translate(-50%, -50%)",
          touchAction: "none",
          userSelect: "none",
          minWidth: 100,
        }}
        animate={{ left: `${pos.x}vw`, top: `${pos.y}vh` }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        whileTap={{ scale: 0.85 }}
        onPointerDown={handleClick}
      >
        {clicks < clicksNeeded ? (labels[Math.min(clicks, labels.length - 1)]) : "DONE!"}
      </motion.button>

      {/* Flash effects */}
      {flashes.map(f => (
        <motion.div
          key={f.id}
          className="fixed pointer-events-none z-40 w-8 h-8 rounded-full"
          style={{
            left: f.x, top: f.y,
            transform: "translate(-50%, -50%)",
            background: theme.accent,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// GAME SELECTOR — dipilih otomatis berdasarkan theme
// ─────────────────────────────────────────────────────────────
export const GameSelector = ({ theme, onComplete }) => {
  const gameByTheme = {
    pixel:     ClickGame,
    valentine: CatchGame,
    cyberpunk: ClickGame,
    kraft:     MemoryGame,
    pastel:    CatchGame,
  };
  const Game = gameByTheme[theme.id] || ClickGame;
  return <Game theme={theme} onComplete={onComplete} />;
};