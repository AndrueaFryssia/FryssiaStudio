import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

// ─────────────────────────────────────────────────────────────
// FRAME MINI PREVIEW
// Same "invisible spacer" trick as CameraSystem — the PNG itself
// dictates the container height so nothing is ever cropped.
// ─────────────────────────────────────────────────────────────
const FrameMiniPreview = ({ frame }) => {
  const { bgColor, accentColor, layout, slots, customOverlayUrl } = frame;

  if (customOverlayUrl) {
    return (
      // Fixed width; height = natural ratio of the PNG
      <div style={{ width: 72, position: "relative", flexShrink: 0 }}>
        {/* Spacer — establishes height from the image's own ratio */}
        <img
          src={customOverlayUrl}
          alt=""
          aria-hidden="true"
          style={{ display: "block", width: "100%", height: "auto", visibility: "hidden" }}
        />
        {/* Actual overlay on top */}
        <img
          src={customOverlayUrl}
          alt={frame.label}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            // No objectFit needed — inset + matching size IS the fit
          }}
        />
      </div>
    );
  }

  // ── Colour-only fallback for non-custom frames ──
  const slotStyle = {
    background: `${accentColor}22`,
    borderRadius: 3,
    flexShrink: 0,
  };

  const isVertical = layout === "vertical-strip";
  const w = 52;
  const h = isVertical ? 156 : layout === "single" ? 52 : 60;

  return (
    <div
      style={{
        width: w,
        height: h,
        background: bgColor,
        border: `2px solid ${accentColor}`,
        borderRadius: 8,
        padding: 4,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {isVertical && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 3 }}>
          {Array.from({ length: slots }).map((_, i) => (
            <div key={i} style={{ flex: 1, ...slotStyle }} />
          ))}
        </div>
      )}
      {layout === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100%", gap: 3 }}>
          {Array.from({ length: slots }).map((_, i) => (
            <div key={i} style={slotStyle} />
          ))}
        </div>
      )}
      {layout === "single" && <div style={{ height: "100%", ...slotStyle }} />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// FRAME SELECTOR
// ─────────────────────────────────────────────────────────────
const FrameSelector = ({ selectedFrame, setSelectedFrame, setStep }) => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFrames = async () => {
      try {
        const { data } = await supabase
          .from("photobooth_frames")
          .select("*")
          .eq("is_active", true)
          .order("sort_order");

        if (data) {
          const mappedFrames = data.map((f) => ({
            id: `db-${f.id}`,
            label: f.name,
            slots: f.slots || 3,
            bgColor: f.bg_color || "#FFF4BD",
            accentColor: "#2C2C2C",
            headerText: f.header_text || "",
            layout: f.layout || "vertical-strip",
            borderStyle: "none",
            customOverlayUrl: f.public_url,
            // slotCoords: percentage-based JSON from admin
            // e.g. [{ top: "10%", left: "5%", width: "90%", height: "28%" }, ...]
            slotCoords: f.slot_coords ? JSON.parse(f.slot_coords) : [],
          }));

          setFrames(mappedFrames);
          if (mappedFrames.length > 0 && !selectedFrame) {
            setSelectedFrame(mappedFrames[0]);
          }
        }
      } catch (error) {
        console.error("Gagal memuat frames:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFrames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="font-retro text-2xl text-center mb-6">Pilih Template Frame</h2>

      {loading ? (
        <p className="text-center font-mono text-sm opacity-50 mb-8 animate-pulse">
          Memuat frame...
        </p>
      ) : frames.length === 0 ? (
        <div className="clay-card bg-pink-light p-6 text-center max-w-md mx-auto mb-8">
          <p className="font-retro text-xl mb-2">Belum Ada Frame 😢</p>
          <p className="font-mono text-sm opacity-60">Tambahkan frame di halaman Admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {frames.map((frame) => {
            const isSelected = selectedFrame?.id === frame.id;
            return (
              <motion.button
                key={frame.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedFrame(frame)}
                className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-2 ${
                  isSelected
                    ? "border-retro-red bg-retro-red/10 shadow-[4px_4px_0_#2C2C2C]"
                    : "border-charcoal bg-white shadow-[3px_3px_0_#2C2C2C] hover:border-retro-red/60"
                }`}
              >
                {/* Selected indicator ring */}
                <div
                  className={`relative rounded-lg transition-all ${
                    isSelected ? "ring-2 ring-retro-red ring-offset-2" : ""
                  }`}
                >
                  <FrameMiniPreview frame={frame} />
                </div>

                <p
                  className={`font-mono text-xs font-bold leading-tight ${
                    isSelected ? "text-retro-red" : "text-charcoal"
                  }`}
                >
                  {frame.label}
                </p>

                {/* Slot count badge */}
                <span className="font-mono text-[10px] opacity-50">
                  {frame.slots} foto
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Selected frame large preview */}
      {selectedFrame?.customOverlayUrl && (
        <motion.div
          key={selectedFrame.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <div
            className="rounded-xl overflow-hidden border-2 border-charcoal shadow-[6px_6px_0_#2C2C2C]"
            style={{ width: 140, position: "relative" }}
          >
            {/* Spacer for natural height */}
            <img
              src={selectedFrame.customOverlayUrl}
              alt=""
              aria-hidden="true"
              style={{ display: "block", width: "100%", height: "auto", visibility: "hidden" }}
            />
            <img
              src={selectedFrame.customOverlayUrl}
              alt={selectedFrame.label}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </motion.div>
      )}

      <div className="text-center">
        <button
          onClick={() => setStep("camera")}
          disabled={!selectedFrame}
          className="clay-btn bg-retro-red text-white text-lg px-12 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lanjut ke Kamera →
        </button>
      </div>
    </motion.div>
  );
};

export default FrameSelector;