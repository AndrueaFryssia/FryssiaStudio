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

const PhotoSlot = ({ src, coord, canvasW, canvasH, activeFilter }) => {
  const [image] = useImage(src, "anonymous");
  
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
  
  const [frameImage] = useImage(selectedFrame.public_url, "anonymous");
  
  const CANVAS_W = frameImage ? frameImage.width : 426;
  const CANVAS_H = frameImage ? frameImage.height : 1280;

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

  useEffect(() => {
    const loadStickers = async () => {
      const { data } = await supabase.from("stickers").select("*").eq("is_active", true);
      setDbStickers(data || []);
    };
    loadStickers();
  }, []);

  // FIX ANTI-GEPENG: Kita hitung rasio asli gambar stiker dulu
  const addSticker = (s) => {
    const id = `sticker-${Date.now()}`;
    const img = new Image();
    img.src = s.public_url;
    img.onload = () => {
      const ratio = img.width / img.height;
      const baseWidth = 150; // Lebar awal stiker
      
      setStickers((prev) => [
        ...prev,
        { 
          id, 
          src: s.public_url, 
          x: CANVAS_W / 2 - baseWidth / 2, 
          y: CANVAS_H / 2 - (baseWidth / ratio) / 2, 
          width: baseWidth,
          height: baseWidth / ratio, // Tinggi otomatis sesuai rasio biar ga gepeng
          scaleX: 1, 
          scaleY: 1, 
          rotation: 0 
        },
      ]);
      setSelectedId(id);
    };
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

  // FUNGSI HAPUS: Untuk stiker dan teks
  const handleDeleteSelected = () => {
    if (!selectedId) return;
    if (selectedId.startsWith("sticker-")) {
      setStickers(prev => prev.filter(s => s.id !== selectedId));
    } else if (selectedId.startsWith("text-")) {
      setTexts(prev => prev.filter(t => t.id !== selectedId));
    }
    setSelectedId(null);
  };

  const handleExport = () => {
    setSelectedId(null);
    setTimeout(() => {
      if (stageRef.current) {
        const dataUrl = stageRef.current.toDataURL({ 
          pixelRatio: 1 / stageScale 
        });
        setFinalImage(dataUrl);
        setStep("download");
      }
    }, 100);
  };

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-6 p-4">
      <div className="flex flex-col items-center">
        <div ref={containerRef} className="w-full max-w-[320px] mx-auto overflow-hidden shadow-2xl rounded-xl border-[3px] border-slate-800 bg-[#1a1a1a]">
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
              {selectedFrame.slot_coords && JSON.parse(selectedFrame.slot_coords).map((coord, i) => (
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

              {frameImage && <KonvaImage image={frameImage} width={CANVAS_W} height={CANVAS_H} listening={false} />}

              {stickers.map((st) => (
                <DraggableSticker
                  key={st.id}
                  {...st}
                  isSelected={st.id === selectedId}
                  onSelect={setSelectedId}
                  onChange={(id, newProps) => setStickers(prev => prev.map(s => s.id === id ? { ...s, ...newProps } : s))}
                />
              ))}

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
        <div className="bg-white border-[3px] border-slate-800 p-4 rounded-xl shadow-[4px_4px_0_#1e293b]">
          <h3 className="font-retro text-xl mb-4 text-slate-800 tracking-tighter">DEKORASI</h3>
          
          <div className="flex border-b-2 border-slate-100 mb-4">
            <button onClick={() => setTab("stickers")} className={`flex-1 py-2 font-mono text-[10px] font-bold uppercase tracking-widest ${tab === "stickers" ? "border-b-2 border-pink-500 text-pink-500" : "text-slate-400"}`}>Stiker</button>
            <button onClick={() => setTab("text")} className={`flex-1 py-2 font-mono text-[10px] font-bold uppercase tracking-widest ${tab === "text" ? "border-b-2 border-pink-500 text-pink-500" : "text-slate-400"}`}>Teks</button>
          </div>

          {selectedId && (
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleDeleteSelected}
              className="w-full mb-4 bg-pink-500 text-white font-mono text-[10px] font-bold py-2 rounded-lg border-2 border-slate-800 shadow-[2px_2px_0_#1e293b] uppercase"
            >
              🗑️ Hapus Terpilih
            </motion.button>
          )}

          {tab === "stickers" && (
            <div className="overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
               {dbStickers.length === 0 ? (
                  <p className="text-center font-mono text-[10px] opacity-40 py-4 italic">Belum ada stiker...</p>
               ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {dbStickers.map((s) => (
                      <button key={s.id} onClick={() => addSticker(s)} className="p-2 hover:bg-pink-50 rounded-xl border-2 border-slate-100 hover:border-pink-200 transition-all">
                        <img src={s.public_url} className="w-full h-12 object-contain" alt="sticker" />
                      </button>
                    ))}
                  </div>
               )}
            </div>
          )}

          {tab === "text" && (
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Tulis di sini..." value={textInput} onChange={(e) => setTextInput(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 font-body text-sm outline-none focus:border-pink-400" />
              <div className="flex gap-2 items-center">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded border-2 border-slate-800 cursor-pointer" />
                <input type="range" min={20} max={200} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="flex-1 accent-pink-500" />
              </div>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 font-mono text-xs">
                {FONT_FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <button onClick={addText} className="bg-slate-800 text-white w-full py-3 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest disabled:opacity-30" disabled={!textInput.trim()}>+ Tambah Teks</button>
            </div>
          )}
        </div>

        <button onClick={handleExport} className="clay-btn-primary w-full py-5 text-lg">SIMPAN & DOWNLOAD</button>
        <button onClick={() => setStep("camera")} className="font-mono text-[10px] font-bold text-slate-400 hover:text-slate-800 uppercase tracking-widest transition-all">
          ← Kembali Jepret
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;
