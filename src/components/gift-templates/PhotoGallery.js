// src/components/gift-templates/PhotoGallery.js
// ─────────────────────────────────────────────────────────────
// 3 layouts:
//   polaroid  — tactile stacked Polaroids, drag/tap to cycle
//   slideshow — swipe-style with prev/next
//   grid      — masonry-ish grid with tap-to-fullscreen
//
// Photos fetched from Supabase Storage bucket "gift-photos"
// Mobile-first, no emoji, theme-aware.
// ─────────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const BUCKET = "gift-photos";

const getUrl = (path) =>
  !path ? "" :
  path.startsWith("http") ? path :
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

// ─────────────────────────────────────────────────────────────
// POLAROID STACK — most tactile layout
// Kartu foto ditumpuk dengan rotasi, tap untuk ganti
// Terasa seperti lagi pegang foto fisik
// ─────────────────────────────────────────────────────────────
const ROTATIONS = [-5, 3, -2, 6, -4, 2, 5, -3];
const OFFSETS   = [
  { x: 0,  y: 0 },
  { x: -6, y: 4 },
  { x: 8,  y: -3 },
  { x: -4, y: 6 },
  { x: 6,  y: -5 },
];

const PolaroidStack = ({ photos, theme }) => {
  const [current, setCurrent] = useState(0);
  const [isLifting, setIsLifting] = useState(false);

  const advance = () => {
    if (isLifting) return;
    setIsLifting(true);
    setTimeout(() => {
      setCurrent(c => (c + 1) % photos.length);
      setIsLifting(false);
    }, 350);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Stack container */}
      <div
        className="relative cursor-pointer"
        style={{ width: "min(260px, 82vw)", height: "min(280px, 88vw)" }}
        onPointerDown={advance}
      >
        {/* Back cards (decorative) */}
        {photos.slice(1, 4).reverse().map((_, reverseIdx) => {
          const actualIdx = 3 - reverseIdx;
          const rot   = ROTATIONS[(current + actualIdx) % ROTATIONS.length];
          const off   = OFFSETS[actualIdx % OFFSETS.length];
          return (
            <div
              key={actualIdx}
              className="absolute inset-0"
              style={{
                transform: `rotate(${rot}deg) translate(${off.x}px, ${off.y}px)`,
                background: "#fff",
                border: `2px solid ${theme.border}`,
                boxShadow: `3px 3px 0 rgba(0,0,0,0.12)`,
                padding: "8px 8px 36px",
                zIndex: 5 - actualIdx,
              }}
            />
          );
        })}

        {/* Active top Polaroid */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "#fff",
            border: `2px solid ${theme.border}`,
            boxShadow: "6px 8px 24px rgba(0,0,0,0.18)",
            padding: "8px 8px 36px",
            zIndex: 10,
            transformOrigin: "center bottom",
          }}
          animate={
            isLifting
              ? { rotate: 8, y: -20, scale: 0.95, opacity: 0.8 }
              : { rotate: 0, y: 0, scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <img
            src={getUrl(photos[current])}
            alt={`Foto ${current + 1}`}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
            loading="lazy"
            onError={(e) => {
              e.target.style.background = theme.bgSecondary;
              e.target.style.height = "100%";
            }}
          />
          {/* Polaroid bottom label area */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
            style={{ height: 36 }}
          >
            <p
              className="text-xs"
              style={{
                fontFamily: theme.fontBody,
                color: theme.textMuted,
                fontSize: 10,
                opacity: 0.6,
              }}
            >
              {current + 1} / {photos.length}
            </p>
          </div>
        </motion.div>

        {/* "Tap" hint on first view */}
        {photos.length > 1 && (
          <motion.div
            className="absolute -bottom-8 left-0 right-0 text-center"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 2, repeat: 3 }}
          >
            <p className="text-xs" style={{ fontFamily: theme.fontBody, color: theme.textMuted }}>
              tap untuk foto berikutnya
            </p>
          </motion.div>
        )}
      </div>

      {/* Dot navigation */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-8">
          {photos.map((_, i) => (
            <button
              key={i}
              onPointerDown={() => { if (!isLifting) { setIsLifting(true); setTimeout(() => { setCurrent(i); setIsLifting(false); }, 200); } }}
              className="transition-all duration-200"
              style={{
                width: i === current ? 18 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? theme.accent : theme.bgSecondary,
                border: `1.5px solid ${theme.border}`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SLIDESHOW — swipe or button navigation
// ─────────────────────────────────────────────────────────────
const Slideshow = ({ photos, theme }) => {
  const [idx, setIdx]   = useState(0);
  const [dir, setDir]   = useState(1);
  const dragX           = useMotionValue(0);
  const dragOpacity     = useTransform(dragX, [-60, 0, 60], [0.5, 1, 0.5]);

  const go = (delta) => {
    setDir(delta);
    setIdx(i => (i + delta + photos.length) % photos.length);
  };

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 50) {
      go(info.offset.x < 0 ? 1 : -1);
    }
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? "70%" : "-70%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? "-70%" : "70%", opacity: 0 }),
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Frame */}
      <div
        className="relative overflow-hidden w-full"
        style={{
          aspectRatio: "4/3",
          maxWidth: "min(380px, 100%)",
          border: `2px solid ${theme.border}`,
          boxShadow: `6px 6px 0 ${theme.border}`,
          background: theme.bgSecondary,
        }}
      >
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.img
            key={`${idx}-${photos[idx]}`}
            src={getUrl(photos[idx])}
            alt={`Foto ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX, opacity: dragOpacity }}
            onDragEnd={handleDragEnd}
            loading="lazy"
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {photos.length > 1 && (
          <>
            {[
              { side: "left", delta: -1, label: "‹" },
              { side: "right", delta: 1, label: "›" },
            ].map(({ side, delta, label }) => (
              <button
                key={side}
                onPointerDown={() => go(delta)}
                className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-2" : "right-2"} w-9 h-9 flex items-center justify-center font-bold text-lg z-10`}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  borderRadius: 4,
                  border: "none",
                }}
              >
                {label}
              </button>
            ))}
          </>
        )}

        {/* Counter */}
        <div
          className="absolute bottom-2 right-2 text-xs font-mono px-2 py-0.5"
          style={{ background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 3 }}
        >
          {idx + 1}/{photos.length}
        </div>
      </div>

      {/* Dot navigation */}
      {photos.length > 1 && (
        <div className="flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onPointerDown={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 20 : 8,
                background: i === idx ? theme.accent : theme.bgSecondary,
                border: `1.5px solid ${theme.border}`,
              }}
            />
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <p className="text-xs" style={{ fontFamily: theme.fontBody, color: theme.textMuted }}>
          geser foto untuk navigasi
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// GRID — mosaic with full-screen lightbox
// ─────────────────────────────────────────────────────────────
const Grid = ({ photos, theme }) => {
  const [lightbox, setLightbox] = useState(null);
  const sliced = photos.slice(0, 5);

  const configs = {
    1: [{ colSpan: 2, aspectRatio: "4/3" }],
    2: [{ colSpan: 1, aspectRatio: "1" }, { colSpan: 1, aspectRatio: "1" }],
    3: [{ colSpan: 2, aspectRatio: "16/9" }, { colSpan: 1, aspectRatio: "1" }, { colSpan: 1, aspectRatio: "1" }],
    4: [{ colSpan: 2, aspectRatio: "16/9" }, { colSpan: 1, aspectRatio: "1" }, { colSpan: 1, aspectRatio: "1" }, { colSpan: 2, aspectRatio: "16/9" }],
    5: [
      { colSpan: 2, aspectRatio: "16/9" },
      { colSpan: 1, aspectRatio: "1" }, { colSpan: 1, aspectRatio: "1" },
      { colSpan: 1, aspectRatio: "1" }, { colSpan: 1, aspectRatio: "1" },
    ],
  };
  const layout = configs[sliced.length] || configs[1];

  return (
    <>
      <div
        className="grid gap-2 w-full"
        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        {sliced.map((path, i) => {
          const cfg = layout[i] || { colSpan: 1, aspectRatio: "1" };
          return (
            <motion.button
              key={i}
              className="overflow-hidden"
              style={{
                gridColumn: `span ${cfg.colSpan}`,
                aspectRatio: cfg.aspectRatio,
                border: `2px solid ${theme.border}`,
                boxShadow: `4px 4px 0 ${theme.border}`,
                cursor: "pointer",
                background: theme.bgSecondary,
              }}
              whileTap={{ scale: 0.97 }}
              onPointerDown={() => setLightbox(i)}
            >
              <img
                src={getUrl(path)}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.target.style.opacity = "0.3"; }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.93)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={() => setLightbox(null)}
          >
            <motion.img
              src={getUrl(sliced[lightbox])}
              alt="Lightbox"
              className="max-w-full max-h-full object-contain rounded"
              style={{ maxWidth: "94vw", maxHeight: "90vh" }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onPointerDown={e => e.stopPropagation()}
            />
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white font-bold"
              style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, fontSize: 18 }}
              onPointerDown={() => setLightbox(null)}
            >
              ×
            </button>
            {/* Lightbox nav */}
            {sliced.length > 1 && (
              <>
                {[{ dir: -1, side: "left", label: "‹" }, { dir: 1, side: "right", label: "›" }].map(({ dir, side, label }) => (
                  <button
                    key={side}
                    className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-3" : "right-3"} w-10 h-10 flex items-center justify-center font-bold text-xl`}
                    style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 6 }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setLightbox(i => (i + dir + sliced.length) % sliced.length);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// EXPORT: PHOTO GALLERY ROUTER
// ─────────────────────────────────────────────────────────────
const PhotoGallery = ({ photos, layout = "polaroid", theme }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {layout === "polaroid"  && <PolaroidStack photos={photos} theme={theme} />}
      {layout === "slideshow" && <Slideshow     photos={photos} theme={theme} />}
      {layout === "grid"      && <Grid          photos={photos} theme={theme} />}
    </motion.div>
  );
};

export default PhotoGallery;