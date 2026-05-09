import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import FrameSelector from "../components/photobooth/FrameSelector";
import CameraSystem from "../components/photobooth/CameraSystem";
import CanvasEditor from "../components/photobooth/CanvasEditor";
import DownloadPreview from "../components/photobooth/DownloadPreview";

const STEPS = ["frame", "camera", "edit", "download"];
const STEP_LABELS = ["Frame", "Kamera", "Edit", "Simpan"];

const PhotoboothPage = () => {
  const [step, setStep] = useState("frame");
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState({ id: "normal", label: "Normal", css: "none" });
  const [finalImage, setFinalImage] = useState(null);

  const currentIdx = STEPS.indexOf(step);

  const resetPhotobooth = () => {
    setCapturedPhotos([]);
    setFinalImage(null);
    setSelectedFrame(null);
    setStep("frame");
  };

  const goBack = () => {
    if (currentIdx > 0) setStep(STEPS[currentIdx - 1]);
  };

  return (
    <main className="min-h-screen bg-cream py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-block font-mono text-[10px] bg-retro-red text-white px-3 py-1 rounded-full border-2 border-charcoal mb-3 uppercase tracking-widest">
            ◉ Photobooth
          </span>
          <h1 className="font-retro text-4xl md:text-5xl text-charcoal">Buat Kenangan Indah</h1>
        </motion.div>

        {/* ── STEP INDICATOR ── */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {STEPS.map((s, i) => {
            const isDone = currentIdx > i;
            const isActive = step === s;
            return (
              <div key={s} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <motion.div
                    whileHover={isActive ? {} : { scale: 1.1 }}
                    className={`w-8 h-8 rounded-full border-2 border-charcoal flex items-center justify-center text-xs font-bold font-mono transition-all
                      ${isActive ? "bg-retro-red text-white shadow-[2px_2px_0_#2C2C2C]" :
                        isDone ? "bg-butter text-charcoal" : "bg-white text-charcoal/30"}`}
                  >
                    {isDone ? "✓" : i + 1}
                  </motion.div>
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${isActive ? "text-retro-red font-bold" : "text-charcoal/40"}`}>
                    {STEP_LABELS[i]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mb-4 transition-all ${isDone ? "bg-retro-red" : "bg-charcoal/20"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── CONTENT ── */}
        <AnimatePresence mode="wait">
          {step === "frame" && (
            <FrameSelector
              key="frame"
              selectedFrame={selectedFrame}
              setSelectedFrame={setSelectedFrame}
              setStep={setStep}
            />
          )}
          {step === "camera" && (
            <CameraSystem
              key="camera"
              selectedFrame={selectedFrame}
              capturedPhotos={capturedPhotos}
              setCapturedPhotos={setCapturedPhotos}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              setStep={setStep}
            />
          )}
          {step === "edit" && (
            <CanvasEditor
              key="edit"
              selectedFrame={selectedFrame}
              capturedPhotos={capturedPhotos}
              activeFilter={activeFilter}
              setFinalImage={setFinalImage}
              setStep={setStep}
            />
          )}
          {step === "download" && (
            <DownloadPreview
              key="download"
              finalImage={finalImage}
              resetPhotobooth={resetPhotobooth}
              setStep={setStep}
            />
          )}
        </AnimatePresence>

        {/* ── BACK BUTTON ── */}
        {step !== "frame" && step !== "download" && (
          <div className="mt-6">
            <button onClick={goBack} className="clay-btn bg-white text-sm">
              ← Kembali
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default PhotoboothPage;