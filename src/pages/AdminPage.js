import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

// ============================================================================
// 1. VISUAL SLOT EDITOR (DRAG & DROP GUI)
// ============================================================================
const VisualSlotEditor = ({ previewUrl, coords, onChange }) => {
  const containerRef = useRef(null);

  const handlePointerDown = (e, index, type) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const startBox = { ...coords[index] };

    const handlePointerMove = (moveEvent) => {
      const currentX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const currentY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      
      const deltaXPct = ((currentX - startX) / rect.width) * 100;
      const deltaYPct = ((currentY - startY) / rect.height) * 100;

      let newBox = { ...startBox };
      
      if (type === 'move') {
        newBox.left = Math.max(0, Math.min(100 - newBox.width, startBox.left + deltaXPct));
        newBox.top = Math.max(0, Math.min(100 - newBox.height, startBox.top + deltaYPct));
      } else if (type === 'resize') {
        newBox.width = Math.max(5, Math.min(100 - newBox.left, startBox.width + deltaXPct));
        newBox.height = Math.max(5, Math.min(100 - newBox.top, startBox.height + deltaYPct));
      }

      const newCoords = [...coords];
      newCoords[index] = newBox;
      onChange(newCoords);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  };

  if (!previewUrl) {
    return (
      <div className="w-full p-8 border-2 border-dashed border-white/20 rounded-xl text-center text-white/40 font-mono text-xs">
        [Upload file PNG dulu buat buka Visual Editor]
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full bg-[#111] p-4 rounded-xl border border-white/10">
      <p className="font-mono text-xs text-butter mb-4 text-center">
        Tahan & Geser kotak merah ke area transparan frame.<br/>
        Tarik pojok kanan bawah buat ubah ukuran!
      </p>
      
      <div 
        ref={containerRef} 
        className="relative w-full max-w-[220px] bg-black border-2 border-charcoal shadow-2xl rounded-lg overflow-hidden touch-none select-none"
        style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}
      >
        <img src={previewUrl} alt="preview" className="w-full h-auto block pointer-events-none opacity-80" />

        {coords.map((box, i) => (
          <div
            key={i}
            className="absolute border-[3px] border-retro-red bg-retro-red/30 cursor-move flex items-center justify-center shadow-lg hover:bg-retro-red/50 transition-colors duration-150"
            style={{ top: `${box.top}%`, left: `${box.left}%`, width: `${box.width}%`, height: `${box.height}%` }}
            onPointerDown={(e) => handlePointerDown(e, i, 'move')}
          >
            <span className="font-mono text-[10px] text-white font-bold drop-shadow-md pointer-events-none">FOTO {i+1}</span>
            
            <div
              className="absolute bottom-[-3px] right-[-3px] w-6 h-6 bg-white border-[3px] border-retro-red cursor-se-resize rounded-tl-xl flex items-center justify-center hover:scale-110 transition-transform"
              onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, i, 'resize'); }}
            >
              <span className="text-[10px] text-black pointer-events-none font-bold">↘</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 2. MAIN ADMIN PAGE
// ============================================================================
const AdminPage = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const [checking, setChecking] = useState(true); // Tambahan state buat nahan blank screen
  const [activeTab, setActiveTab] = useState("frames"); 
  const [stickers, setStickers] = useState([]);
  const [frames, setFrames] = useState([]);
  
  const [uploadingSticker, setUploadingSticker] = useState(false);
  const [uploadingFrame, setUploadingFrame] = useState(false);
  
  // Form Stiker
  const [stickerName, setStickerName] = useState("");
  const stickerFileRef = useRef();
  
  // Form Frame
  const [frameName, setFrameName] = useState("");
  const [frameSlots, setFrameSlots] = useState(3);
  const [framePreviewUrl, setFramePreviewUrl] = useState(null);
  
  const [visualCoords, setVisualCoords] = useState([]);
  const frameFileRef = useRef();

  // ─────────────────────────────────────────────────────────────────
  // PERBAIKAN LOGIC REDIRECT (ANTI-LOOPING & ANTI-BLANK)
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("Akses Ditolak: Belum Login");
        navigate("/login", { replace: true });
      } else if (!isAdmin) {
        console.log("Akses Ditolak: Bukan Admin!");
        alert("Kamu bukan Admin! Izin ditolak.");
        navigate("/", { replace: true });
      } else {
        // Kalau lolos semua ujian (Udah login & beneran admin)
        setChecking(false);
      }
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    // Jangan nge-fetch data kalau belom lolos pengecekan (biar ga error RLS)
    if (!checking) {
      fetchStickers(); 
      fetchFrames();
    }
  }, [checking]); 

  // Auto-generate kotak awal kalau slot diganti
  useEffect(() => {
    const slots = parseInt(frameSlots) || 1;
    const arr = [];
    const h = 80 / slots;
    for(let i=0; i<slots; i++) {
      arr.push({ top: 10 + (i * (h + 2)), left: 10, width: 80, height: h });
    }
    setVisualCoords(arr);
  }, [frameSlots]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFramePreviewUrl(URL.createObjectURL(file));
    else setFramePreviewUrl(null);
  };

  const fetchStickers = async () => {
    const { data } = await supabase.from("stickers").select("*").order("created_at", { ascending: false });
    setStickers(data || []);
  };
  
  const fetchFrames = async () => {
    const { data } = await supabase.from("photobooth_frames").select("*").order("created_at", { ascending: false });
    setFrames(data || []);
  };

  const handleStickerUpload = async () => {
    const file = stickerFileRef.current?.files[0];
    if (!file || !stickerName.trim()) return alert("Isi nama dan pilih file PNG!"); 
    
    setUploadingSticker(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
      const path = `stickers/${fileName}`;

      // 1. Upload ke Storage Bucket "stickers"
      const { error: storageErr } = await supabase.storage.from("stickers").upload(path, file);
      if (storageErr) throw storageErr;

      // 2. Ambil Public URL
      const { data: { publicUrl } } = supabase.storage.from("stickers").getPublicUrl(path);

      // 3. Masukin ke DB Tabel "stickers"
      const { error: dbErr } = await supabase.from("stickers").insert({ 
        name: stickerName.trim(), 
        storage_path: path, 
        public_url: publicUrl, 
        category: "general",
        is_active: true 
      });
      if (dbErr) throw dbErr;

      setStickerName(""); 
      stickerFileRef.current.value = "";
      await fetchStickers(); // Langsung refresh list
      alert("Stiker berhasil nangkring di server! 🔥");
    } catch (err) { 
        alert(`Gagal: ${err.message}`); 
    } finally { 
        setUploadingSticker(false); 
    }
  };

  const deleteSticker = async (id, path) => {
    if (!window.confirm("Beneran mau hapus stiker ini?")) return;
    try {
      await supabase.storage.from("stickers").remove([path]);
      await supabase.from("stickers").delete().eq("id", id);
      fetchStickers();
    } catch (err) {
      alert(`Gagal hapus stiker: ${err.message}`);
    }
  };

  const handleFrameUpload = async () => {
    const file = frameFileRef.current?.files[0];
    if (!file || !frameName.trim()) return alert("Nama & File Frame wajib diisi!");

    const finalCoords = visualCoords.map(c => ({
      top: `${c.top.toFixed(2)}%`,
      left: `${c.left.toFixed(2)}%`,
      width: `${c.width.toFixed(2)}%`,
      height: `${c.height.toFixed(2)}%`
    }));

    setUploadingFrame(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
      const path = `frames/${fileName}`;
      // Pake bucket "stickers" biar kumpul jadi satu aset
      await supabase.storage.from("stickers").upload(path, file);
      const { data: { publicUrl } } = supabase.storage.from("stickers").getPublicUrl(path);

      await supabase.from("photobooth_frames").insert({
        name: frameName.trim(),
        public_url: publicUrl,
        storage_path: path,
        slots: parseInt(frameSlots),
        layout: "custom-upload", 
        bg_color: "transparent",
        slot_coords: JSON.stringify(finalCoords),
        is_active: true,
      });

      alert("Frame berhasil disimpan!");
      setFrameName(""); setFramePreviewUrl(null);
      frameFileRef.current.value = "";
      fetchFrames();
    } catch (err) { alert(`Gagal: ${err.message}`); } 
    finally { setUploadingFrame(false); }
  };

  const deleteFrame = async (id, path) => {
    if (!window.confirm("Hapus frame ini?")) return;
    await supabase.storage.from("stickers").remove([path]);
    await supabase.from("photobooth_frames").delete().eq("id", id);
    fetchFrames();
  };

  // Tampilkan loading screen SEBELUM ngerender isi admin page ATAU saat lagi ngecek akses
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center font-retro">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="text-4xl text-butter mb-4">
          ⚙️
        </motion.div>
        <p className="text-butter/60 text-xs tracking-widest font-mono">VERIFYING ADMIN ACCESS...</p>
      </div>
    );
  }

  const tabs = [{ id: "frames", label: "📸 Frame Booth" }, { id: "stickers", label: "✦ Stiker Editor" }];

  return (
    <main className="min-h-screen bg-[#111] text-white py-8 px-4 pb-24 font-body">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-retro text-4xl text-butter mb-8 tracking-tighter">STUDIO ADMIN <span className="text-retro-red">CONTROL</span></h1>

        <div className="flex gap-2 mb-10 bg-charcoal/50 p-2 rounded-2xl w-fit border border-white/10 backdrop-blur-md">
          {tabs.map((t) => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)} 
              className={`font-mono text-[11px] uppercase tracking-widest font-bold py-3 px-8 rounded-xl transition-all ${activeTab === t.id ? "bg-retro-red text-white shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ==================== TAB STIKER ==================== */}
          {activeTab === "stickers" && (
            <motion.div key="stc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid lg:grid-cols-[400px_1fr] gap-8">
              
              {/* Form Upload */}
              <div className="bg-charcoal p-8 rounded-3xl border border-white/10 h-fit shadow-2xl">
                <h3 className="font-retro text-2xl text-butter mb-6 border-b border-white/5 pb-4">New Sticker</h3>
                <div className="space-y-6">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-white/40 block mb-2">Display Name</label>
                    <input type="text" placeholder="e.g. Star Pixel" value={stickerName} onChange={e => setStickerName(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm focus:border-retro-red outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase text-white/40 block mb-2">PNG File (Transparent)</label>
                    <input type="file" ref={stickerFileRef} accept="image/png" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs file:bg-retro-red file:border-none file:text-white file:px-3 file:py-1 file:rounded file:mr-4 file:font-bold cursor-pointer"/>
                  </div>
                  <button 
                    onClick={handleStickerUpload} 
                    disabled={uploadingSticker} 
                    className="w-full bg-butter text-charcoal font-retro text-xl py-5 rounded-2xl hover:bg-white transition-all shadow-[6px_6px_0_#D93025] disabled:opacity-50"
                  >
                    {uploadingSticker ? "UPLOADING..." : "SAVE STICKER"}
                  </button>
                </div>
              </div>

              {/* List Koleksi */}
              <div className="bg-charcoal p-8 rounded-3xl border border-white/10 shadow-2xl min-h-[500px]">
                <h3 className="font-retro text-2xl text-butter border-b border-white/5 mb-8 pb-4">Sticker Library</h3>
                {stickers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                     <span className="text-6xl mb-4">👻</span>
                     <p className="font-mono text-sm uppercase tracking-widest">Library is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {stickers.map((st) => (
                      <motion.div layout key={st.id} className="group bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-retro-red transition-all flex flex-col items-center relative">
                        <div className="w-full aspect-square bg-[#0a0a0a] rounded-xl mb-4 p-4 flex items-center justify-center border border-white/5 overflow-hidden">
                          <img src={st.public_url} alt={st.name} className="max-w-full max-h-full object-contain drop-shadow-[0_5px_15px_rgba(217,48,37,0.3)]" />
                        </div>
                        <p className="font-mono text-[10px] font-bold text-white/80 truncate w-full text-center mb-3 uppercase tracking-tighter">{st.name}</p>
                        <button 
                          onClick={() => deleteSticker(st.id, st.storage_path)} 
                          className="w-full bg-retro-red/20 text-retro-red text-[9px] font-bold py-2 rounded-lg hover:bg-retro-red hover:text-white transition-all uppercase tracking-widest"
                        >
                          Delete
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== TAB FRAMES ==================== */}
          {activeTab === "frames" && (
            <motion.div key="frm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid lg:grid-cols-[450px_1fr] gap-8">
              
              <div className="bg-charcoal p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 h-fit">
                <h3 className="font-retro text-2xl text-butter border-b border-white/5 pb-4 text-center uppercase tracking-tighter">Frame Visual Builder</h3>
                
                <div className="space-y-4 bg-black/30 p-5 rounded-2xl border border-white/5">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-white/40 block mb-2">Frame Label</label>
                    <input type="text" value={frameName} onChange={(e) => setFrameName(e.target.value)} placeholder="e.g. Classic White" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm focus:border-retro-red outline-none" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase text-white/40 block mb-2">Overlay PNG (Transparent Only)</label>
                    <input ref={frameFileRef} type="file" accept="image/png" onChange={handleFileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white/60" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase text-butter block mb-2">Photos Count</label>
                    <select value={frameSlots} onChange={(e) => setFrameSlots(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm cursor-pointer appearance-none">
                      {[1,2,3,4].map(num => <option key={num} value={num}>{num} Slots</option>)}
                    </select>
                  </div>
                </div>

                <VisualSlotEditor previewUrl={framePreviewUrl} coords={visualCoords} onChange={setVisualCoords} />

                <button 
                    onClick={handleFrameUpload} 
                    disabled={uploadingFrame} 
                    className="w-full bg-retro-red text-white font-retro text-2xl py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(217,48,37,0.3)]"
                >
                  {uploadingFrame ? "SAVING..." : "PUBLISH FRAME"}
                </button>
              </div>

              <div className="bg-charcoal p-8 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="font-retro text-2xl text-butter border-b border-white/5 mb-8 pb-4">Frame Collection</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {frames.map((frame) => (
                    <div key={frame.id} className="group bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-butter transition-all relative overflow-hidden">
                      <div className="w-full aspect-[426/1280] rounded-xl overflow-hidden border border-white/5 mb-4 bg-[#0a0a0a] relative">
                        <img src={frame.public_url} alt={frame.name} className="w-full h-full object-fill z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-20">
                             <button 
                               onClick={() => deleteFrame(frame.id, frame.storage_path)} 
                               className="bg-retro-red text-white font-mono text-[10px] py-3 rounded-lg font-bold shadow-lg uppercase tracking-widest"
                             >
                               Delete Frame
                             </button>
                        </div>
                      </div>
                      <p className="font-mono text-[10px] font-bold text-white/60 truncate uppercase tracking-tighter text-center">{frame.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default AdminPage;
