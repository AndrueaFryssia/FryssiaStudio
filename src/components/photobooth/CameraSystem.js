import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = [
  { id: "normal", label: "Normal", css: "none" },
  { id: "bw", label: "B&W", css: "grayscale(100%)" },
  { id: "retro", label: "Retro", css: "saturate(1.4) contrast(1.1) brightness(1.05) hue-rotate(10deg)" }
];

const CameraSystem = ({ selectedFrame, capturedPhotos, setCapturedPhotos, activeFilter, setActiveFilter, setStep }) => {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const allPhotosCaptured = capturedPhotos.filter(Boolean).length >= selectedFrame.slots;

  const captureSlot = useCallback((slotIndex) => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          setCapturedPhotos(prev => { const arr = [...prev]; arr[slotIndex] = imageSrc; return arr; });
        }
      } else setCountdown(count);
    }, 1000);
  }, [setCapturedPhotos]);

  const isCustomFrame = selectedFrame.layout === "custom-upload";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-2 gap-6">
      
      <div className="flex flex-col items-center">
        <h3 className="font-retro text-2xl mb-4 w-full text-left">Live Camera</h3>
        <div className="relative rounded-xl border-2 border-charcoal overflow-hidden bg-charcoal shadow-[6px_6px_0_#2C2C2C] w-full" style={{ aspectRatio: "4/3" }} >
          <Webcam
            ref={webcamRef} audio={false} screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: activeFilter.css }}
          />
          <AnimatePresence>
            {countdown !== null && (
              <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                <span className="font-retro text-9xl text-white">{countdown}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-30">
            <button onClick={() => setFacingMode(m => m === "user" ? "environment" : "user")} className="clay-btn-secondary py-2 px-3 text-xs">↻ Balik</button>
            <button onClick={() => captureSlot(capturedPhotos.filter(Boolean).length)} disabled={countdown !== null || allPhotosCaptured} className="clay-btn-primary py-2 px-5 text-sm">Ambil Foto</button>
          </div>
        </div>
        <div className="mt-4 flex gap-2 w-full justify-start">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f)} className={`clay-btn text-xs py-1.5 px-3 ${activeFilter.id === f.id ? "bg-retro-red text-white" : "bg-white"}`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center md:items-start">
        <h3 className="font-retro text-2xl mb-4 w-full text-left">Hasil ({capturedPhotos.filter(Boolean).length}/{selectedFrame.slots})</h3>
        
        {isCustomFrame ? (
          <div className="relative rounded-xl border-2 border-charcoal overflow-hidden shadow-[4px_4px_0_#2C2C2C] w-full" style={{ background: selectedFrame.bgColor, aspectRatio: "1/3", maxWidth: "200px" }}>
             
             {/* LOOPING OTOMATIS BACA KORDINAT */}
             <div className="absolute inset-0">
                {selectedFrame.slotCoords?.map((coord, i) => (
                  capturedPhotos[i] && (
                    <img key={i} src={capturedPhotos[i]} alt={`foto-${i+1}`} className="absolute object-cover" style={{ ...coord, filter: activeFilter.css }} />
                  )
                ))}
             </div>
             
             {selectedFrame.customOverlayUrl && (
               <img src={selectedFrame.customOverlayUrl} alt="overlay" className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10" />
             )}
          </div>
        ) : (
          <div className="grid gap-2 grid-cols-2 p-4 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] w-full" style={{ background: selectedFrame.bgColor }}>
            {Array.from({ length: selectedFrame.slots }).map((_, i) => (
              <div key={i} className="relative overflow-hidden border-2 border-charcoal rounded-md" style={{ aspectRatio: "4/3" }}>
                {capturedPhotos[i] ? <img src={capturedPhotos[i]} alt="p" className="w-full h-full object-cover" style={{ filter: activeFilter.css }}/> : <div className="w-full h-full bg-black/5" />}
              </div>
            ))}
          </div>
        )}

        {allPhotosCaptured && <button onClick={() => setStep("edit")} className="mt-4 clay-btn bg-retro-red text-white w-full py-4 text-lg">Edit dan Dekorasi →</button>}
        {!allPhotosCaptured && capturedPhotos.length > 0 && <button onClick={() => setCapturedPhotos([])} className="mt-3 clay-btn bg-white w-full py-2 text-sm">↺ Ulangi</button>}
      </div>

    </motion.div>
  );
};

export default CameraSystem;