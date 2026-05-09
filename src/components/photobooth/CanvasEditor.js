import React, { useRef, useState, useEffect, useMemo } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { motion } from "framer-motion";
import useImage from "use-image";
import { supabase } from "../../lib/supabase";

import DraggableSticker from "./DraggableSticker";
import TextOverlay from "./TextOverlay";

// ============================================================================
// 1. FUNGSI HELPER & FILTER
// ============================================================================
const pct = (str, total) => (parseFloat(str) / 100) * total;

const applyFilterToImage = (imgObj, cssFilter) => {
  if (!imgObj) return null;
  if (!cssFilter || cssFilter === "none") return imgObj;

  const canvas = document.createElement("canvas");
  canvas.width = imgObj.width;
  canvas.height = imgObj.height;
  const ctx = canvas.getContext("2d");
  
  ctx.filter = cssFilter;
  ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
  
  return canvas; 
};

const getCropCover = (image, targetWidth, targetHeight) => {
  if (!image || !image.width || !image.height) {
    return { cropX: 0, cropY: 0, cropWidth: 0, cropHeight: 0 };
  }
  
  const targetRatio = targetWidth / targetHeight;
  const imageRatio = image.width / image.height;
  
  let newWidth, newHeight;
  
  if (targetRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / targetRatio;
  } else {
    newWidth = image.height * targetRatio;
    newHeight = image.height;
  }
  
  return {
    cropX: (image.width - newWidth) / 2,
    cropY: (image.height - newHeight) / 2,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
};

// ============================================================================
// 2. KOMPONEN SLOT FOTO (Sudah di-FIX React Hooks Rule nya)
// ============================================================================
const PhotoSlot = ({ src, coord, canvasW, canvasH, activeFilter }) => {
  const [image] = useImage(src, "anonymous");
  
  // 🔥 RAHASIA FIX ERROR-nya: useMemo ditaruh di ATAS sebelum ada if / return
  const filteredImage = useMemo(() => {
    return applyFilterToImage(image, activeFilter?.css);
  }, [image, activeFilter]);

  if (!coord) return null;

  const x = pct(coord.left, canvasW);
  const y = pct(coord.top, canvasH);
  const w = pct(coord.width, canvasW);
  const h = pct(coord.height, canvasH);

  const imageToDraw = filteredImage || image;
  const crop = getCropCover(imageToDraw, w, h);

  return (
    <KonvaImage
      image={imageToDraw}
      x={x} y={y} width={w} height={h}
      cropX={crop.cropX} cropY={crop.cropY} cropWidth={crop.cropWidth} cropHeight={crop.cropHeight}
    />
  );
};

// ============================================================================
// 3. KOMPONEN UTAMA EDITOR
// ============================================================================
const FONT_FAMILIES = ["RetroComputer", "Arial", "Courier New", "Georgia", "Impact"];

const CanvasEditor = ({ selectedFrame, capturedPhotos, activeFilter, setFinalImage, setStep }) => {
  const stageRef = useRef();
  const containerRef = useRef();
  
  // Deteksi ukuran asli frame dari user
  const [frameImage] = useImage(selectedFrame.customOverlayUrl, "anonymous");
  
  // Dynamic Canvas Resolution
  const CANVAS_W = frameImage ? frameImage.width : 426;
  const CANVAS_H = frameImage ? frameImage.height : 1280;

  // Scaling untuk layar HP
  const [stageScale, setStageScale] = useState(1);
  
  useEffect(() => {
    if (containerRef.current && CANVAS_W) {
      const containerWidth = containerRef.current.offsetWidth;
      setStageScale(containerWidth / CANVAS_W);
    }
  }, [CANVAS_W]);

  const [tab, setTab] = useState("stickers");
  const [dbStickers, setDbStickers] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [textInput, setTextInput] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  const [fontSize, setFontSize] = useState(60);

  // Load stickers dari Database
  useEffect(() => {
    const loadStickers = async () => {
      const { data } = await supabase.from("stickers").select("*").eq("is_active", true);
      setDbStickers(data || []);
    };
    loadStickers();
  }, []);

  const addSticker = (s) => {
    const id = `sticker-${Date.now()}`;
    setStickers((prev) => [
      ...prev,
      { 
        id, 
        src: s.public_url, 
        x: CANVAS_W / 2 - 50, // Muncul presisi di tengah
        y: CANVAS_H / 2 - 50, 
        scaleX: 1, 
        scaleY: 1, 
        rotation: 0 
      },
    ]);
    setSelectedId(id);
  };

  const addText = () => {
    if (!textInput.trim()) return;
    const id = `text-${Date.now()}`;
    setTexts((prev) => [
      ...prev,
      { 
        id, 
        text: textInput, 
        x: CANVAS_W / 2 - 100, 
        y: CANVAS_H / 2, 
        // Skala font dinamis sesuai lebarnya frame
        fontSize: fontSize * (CANVAS_W / 426), 
        color, 
        fontFamily, 
        scaleX: 1, 
        scaleY: 1, 
        rotation: 0 
      },
    ]);
    setTextInput("");
    setSelectedId(id);
  };

  const handleExport = () => {
    setSelectedId(null);
    setTimeout(() => {
      if (stageRef.current) {
        // RAHASIA DOWNLOAD HIGH RES (Pixel Ratio dimanipulasi)
        const dataUrl = stageRef.current.toDataURL({ 
          pixelRatio: 1 / stageScale 
        });
        setFinalImage(dataUrl);
        setStep("download");
      }
    }, 100);
  };

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-6">
      <div className="flex flex-col items-center">
        <div ref={containerRef} className="w-full max-w-[320px] mx-auto overflow-hidden shadow-2xl rounded-xl border-2 border-charcoal bg-[#1a1a1a]">
          <Stage
            ref={stageRef}
            width={CANVAS_W * stageScale}
            height={CANVAS_H * stageScale}
            scaleX={stageScale}
            scaleY={stageScale}
            onMouseDown={(e) => e.target === e.target.getStage() && setSelectedId(null)}
            onTouchStart={(e) => e.target === e.target.getStage() && setSelectedId(null)}
          >
            <Layer>
              {/* Layer 1: Foto User */}
              {selectedFrame.slotCoords?.map((coord, i) => (
                capturedPhotos[i] && (
                  <PhotoSlot 
                    key={i} 
                    src={capturedPhotos[i]} 
                    coord={coord} 
                    canvasW={CANVAS_W}
                    canvasH={CANVAS_H}
                    activeFilter={activeFilter}
                  />
                )
              ))}

              {/* Layer 2: Frame Overlay PNG */}
              {frameImage && <KonvaImage image={frameImage} width={CANVAS_W} height={CANVAS_H} listening={true} />}

              {/* Layer 3: Stikers */}
              {stickers.map((st) => (
                <DraggableSticker
                  key={st.id}
                  {...st}
                  isSelected={st.id === selectedId}
                  onSelect={setSelectedId}
                  onChange={(id, newProps) => setStickers(prev => prev.map(s => s.id === id ? { ...s, ...newProps } : s))}
                />
              ))}

              {/* Layer 4: Text Overlay */}
              {texts.map((txt) => (
                <TextOverlay
                  key={txt.id}
                  {...txt}
                  isSelected={txt.id === selectedId}
                  onSelect={setSelectedId}
                  onChange={(id, newProps) => setTexts(prev => prev.map(t => t.id === id ? { ...t, ...newProps } : t))}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-retro text-2xl mb-2">Dekorasi</h3>
        <div className="flex border-b-2 border-charcoal/20">
          <button onClick={() => setTab("stickers")} className={`flex-1 py-2 font-mono text-sm font-bold ${tab === "stickers" ? "border-b-2 border-retro-red text-retro-red" : "text-charcoal/50"}`}>✦ Stiker</button>
          <button onClick={() => setTab("text")} className={`flex-1 py-2 font-mono text-sm font-bold ${tab === "text" ? "border-b-2 border-retro-red text-retro-red" : "text-charcoal/50"}`}>A Teks</button>
        </div>

        {tab === "stickers" && (
          <div className="clay-card bg-white p-4 overflow-y-auto max-h-[300px]">
             {dbStickers.length === 0 ? (
                <p className="text-center font-mono text-xs opacity-50">Stiker belum ada.</p>
             ) : (
                <div className="grid grid-cols-4 gap-2">
                  {dbStickers.map((s) => (
                    <button key={s.id} onClick={() => addSticker(s)} className="p-1 hover:bg-butter rounded-lg border border-charcoal/10">
                      <img src={s.public_url} className="w-full h-12 object-contain" alt="" />
                    </button>
                  ))}
                </div>
             )}
          </div>
        )}

        {tab === "text" && (
          <div className="clay-card bg-butter p-4 flex flex-col gap-3">
            <input type="text" placeholder="Tulis sesuatu..." value={textInput} onChange={(e) => setTextInput(e.target.value)} className="w-full border-2 border-charcoal rounded-lg px-3 py-2 font-mono text-sm" />
            <div className="flex gap-2 items-center">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded border-2 border-charcoal cursor-pointer" />
              <input type="range" min={20} max={200} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="flex-1" />
            </div>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full border-2 border-charcoal rounded-lg px-3 py-2 font-mono text-sm">
              {FONT_FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <button onClick={addText} className="clay-btn bg-retro-red text-white w-full py-2 text-sm disabled:opacity-40" disabled={!textInput.trim()}>+ Tambah Teks</button>
          </div>
        )}

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExport} className="mt-4 clay-btn bg-charcoal text-butter w-full py-4 text-lg shadow-[4px_4px_0_#D93025]">Selesai & Download!</motion.button>
        <button onClick={() => setStep("camera")} className="mt-2 text-center w-full font-mono text-xs font-bold text-charcoal/50 hover:text-charcoal transition-colors">
          ← Kembali Jepret
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;