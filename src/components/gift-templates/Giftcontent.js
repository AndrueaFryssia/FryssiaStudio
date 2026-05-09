// src/components/gift-templates/GiftContent.js
// ─────────────────────────────────────────────────────────────
// Content renderer: "letter" (scroll) atau "riddle" (tebak-tebakan).
// Mobile-first. Text overflow fixed: word-break + overflow-wrap.
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoGallery from "./PhotoGallery";

// ─────────────────────────────────────────────────────────────
// LETTER MODE
// ─────────────────────────────────────────────────────────────
const LetterContent = ({ data, theme }) => {
  const photos       = data.photo_paths || [];
  const hasPhotos    = photos.length > 0;
  const layout       = data.photo_layout || "polaroid";

  const stagger = (i) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 + i * 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div
      className="min-h-screen w-full"
      style={theme.bgStyle}
    >
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col gap-8">

        {/* Title block */}
        <motion.div {...stagger(0)} className="text-center">
          <p
            className="text-xs tracking-widest uppercase mb-2"
            style={{ fontFamily: theme.fontBody, color: theme.textMuted }}
          >
            {data.title || "Untuk Kamu"}
          </p>
          <h1
            className="leading-tight"
            style={{
              fontFamily: theme.fontDisplay,
              color: theme.text,
              fontSize: "clamp(2rem, 8vw, 3.5rem)",
              // No text overflow — let it wrap naturally
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {data.recipient_name}
          </h1>
          {/* Theme-specific accent line */}
          <div
            className="mx-auto mt-4"
            style={{
              width: 60,
              height: 3,
              background: theme.accent,
              boxShadow: theme.id === "cyberpunk" ? `0 0 10px ${theme.accent}` : "none",
            }}
          />
        </motion.div>

        {/* Photo gallery */}
        {hasPhotos && (
          <motion.div {...stagger(1)}>
            <PhotoGallery photos={photos} layout={layout} theme={theme} />
          </motion.div>
        )}

        {/* Message card */}
        {data.custom_message && (
          <motion.div
            {...stagger(2)}
            className="w-full p-5 sm:p-6"
            style={{
              ...theme.cardStyle,
              // Ensure text stays inside box
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {/* Decorative quote mark */}
            <div
              className="text-5xl leading-none mb-3 select-none"
              style={{
                fontFamily: theme.fontDisplay,
                color: theme.accent,
                opacity: 0.4,
                lineHeight: 1,
              }}
            >
              "
            </div>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: theme.fontBody,
                color: theme.text,
                fontSize: "clamp(0.9rem, 3.5vw, 1.05rem)",
                lineHeight: 1.8,
                // Critical: prevent overflow
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap", // respect newlines from textarea
              }}
            >
              {data.custom_message}
            </p>
            <div
              className="mt-5 pt-4 text-right text-sm"
              style={{
                fontFamily: theme.fontBody,
                color: theme.textMuted,
                borderTop: `1px solid ${theme.border}22`,
                wordBreak: "break-word",
              }}
            >
              — {data.sender_name}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          {...stagger(3)}
          className="text-center text-xs"
          style={{ fontFamily: theme.fontBody, color: theme.textMuted, opacity: 0.5 }}
        >
          Fryssia Studio · Aktif 24 jam
        </motion.p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// RIDDLE MODE
// ─────────────────────────────────────────────────────────────
const RiddleContent = ({ data, theme }) => {
  const riddles = (() => {
    try {
      if (typeof data.riddles === "string") return JSON.parse(data.riddles);
      return data.riddles || [];
    } catch { return []; }
  })();

  const [current, setCurrent]   = useState(0);
  const [input, setInput]       = useState("");
  const [status, setStatus]     = useState("idle");   // idle | correct | wrong
  const [allDone, setAllDone]   = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  const currentRiddle = riddles[current];
  const isLast        = current === riddles.length - 1;

  const checkAnswer = () => {
    const userAns = input.trim().toLowerCase();
    const correct = currentRiddle.answer?.trim().toLowerCase();
    if (userAns === correct) {
      setStatus("correct");
      setTimeout(() => {
        setInput("");
        setStatus("idle");
        setWrongCount(0);
        if (isLast) setAllDone(true);
        else setCurrent(c => c + 1);
      }, 900);
    } else {
      setStatus("wrong");
      setWrongCount(w => w + 1);
      setTimeout(() => setStatus("idle"), 700);
    }
  };

  const photos    = data.photo_paths || [];
  const hasPhotos = photos.length > 0;

  return (
    <div className="min-h-screen w-full" style={theme.bgStyle}>
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col gap-7">

        {/* Title */}
        <div className="text-center">
          <p
            className="text-xs tracking-widest uppercase mb-2"
            style={{ fontFamily: theme.fontBody, color: theme.textMuted }}
          >
            {data.title || "Tebak dulu..."}
          </p>
          <h1
            style={{
              fontFamily: theme.fontDisplay,
              color: theme.text,
              fontSize: "clamp(1.8rem, 7vw, 3rem)",
              wordBreak: "break-word",
            }}
          >
            {data.recipient_name}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {!allDone ? (
            <motion.div
              key={`riddle-${current}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* Progress */}
              <div className="flex gap-1.5">
                {riddles.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 rounded-full"
                    style={{
                      background: i < current
                        ? theme.accent
                        : i === current
                        ? theme.accentAlt
                        : theme.bgSecondary,
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-xs"
                style={{ fontFamily: theme.fontBody, color: theme.textMuted }}
              >
                Pertanyaan {current + 1} dari {riddles.length}
              </p>

              {/* Question card */}
              <div
                className="p-5"
                style={{
                  ...theme.cardStyle,
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: theme.fontBody,
                    color: theme.text,
                    fontSize: "clamp(1rem, 4vw, 1.15rem)",
                    lineHeight: 1.7,
                    wordBreak: "break-word",
                  }}
                >
                  {currentRiddle?.question}
                </p>
              </div>

              {/* Hint after 3 wrong */}
              {wrongCount >= 3 && currentRiddle?.hint && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-center italic"
                  style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
                >
                  Hint: {currentRiddle.hint}
                </motion.p>
              )}

              {/* Input */}
              <motion.div
                animate={
                  status === "wrong"
                    ? { x: [-6, 6, -6, 6, 0] }
                    : {}
                }
                transition={{ duration: 0.35 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && input.trim() && checkAnswer()}
                  placeholder="Jawaban kamu..."
                  className="flex-1 px-4 py-3 text-base outline-none"
                  style={{
                    background: theme.surface,
                    border: `2px solid ${
                      status === "correct" ? "#22c55e"
                      : status === "wrong" ? "#ef4444"
                      : theme.border
                    }`,
                    color: theme.text,
                    fontFamily: theme.fontBody,
                    // Focus handled inline
                    transition: "border-color 0.2s",
                    wordBreak: "break-word",
                  }}
                  autoComplete="off"
                  autoCapitalize="none"
                />
                <button
                  onPointerDown={checkAnswer}
                  disabled={!input.trim() || status !== "idle"}
                  className="px-5 py-3 font-bold tracking-wide"
                  style={{
                    ...theme.btnStyle,
                    opacity: input.trim() ? 1 : 0.4,
                    cursor: input.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  OK
                </button>
              </motion.div>

              {status === "correct" && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-center font-semibold"
                  style={{ color: "#22c55e", fontFamily: theme.fontBody }}
                >
                  Benar!
                </motion.p>
              )}
            </motion.div>
          ) : (
            /* All done — show final message + photos */
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="text-center">
                <div
                  className="inline-block px-3 py-1 text-xs font-mono mb-3 tracking-wider"
                  style={{ background: theme.accent, color: theme.bg }}
                >
                  SEMUA BENAR
                </div>
                <h2
                  style={{
                    fontFamily: theme.fontDisplay,
                    color: theme.accent,
                    fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
                  }}
                >
                  Buka hadiahnya!
                </h2>
              </div>

              {hasPhotos && (
                <PhotoGallery
                  photos={photos}
                  layout={data.photo_layout || "slideshow"}
                  theme={theme}
                />
              )}

              {data.custom_message && (
                <div
                  className="p-5 sm:p-6"
                  style={{
                    ...theme.cardStyle,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily: theme.fontBody,
                      color: theme.text,
                      fontSize: "clamp(0.9rem, 3.5vw, 1.05rem)",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {data.custom_message}
                  </p>
                  <div
                    className="mt-4 text-right text-sm"
                    style={{ fontFamily: theme.fontBody, color: theme.textMuted }}
                  >
                    — {data.sender_name}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p
          className="text-center text-xs"
          style={{ fontFamily: theme.fontBody, color: theme.textMuted, opacity: 0.4 }}
        >
          Fryssia Studio · Aktif 24 jam
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// EXPORT: CONTENT ROUTER
// ─────────────────────────────────────────────────────────────
const GiftContent = ({ data, theme }) => {
  if (data.content_type === "riddle" && data.riddles) {
    return <RiddleContent data={data} theme={theme} />;
  }
  return <LetterContent data={data} theme={theme} />;
};

export default GiftContent;