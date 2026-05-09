// src/pages/GiftGeneratorPage.js
// ─────────────────────────────────────────────────────────────
// Gift Web Generator — 4-step form, Studio Identity Style.
// Mendukung Multi-photo & Multi-riddle.
// ─────────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { THEMES } from "../components/gift-themes";

// ── Shared UI Styles (Neo-Brutalism) ──────────────────────────
const UI = {
  card: "bg-white border-4 border-charcoal shadow-[8px_8px_0_#2C2C2C] rounded-3xl p-6 mb-6",
  label: "font-retro text-xs text-charcoal/50 uppercase tracking-widest mb-2 block",
  input: "w-full bg-cream border-2 border-charcoal rounded-xl p-3 font-body text-sm outline-none focus:border-retro-red shadow-[2px_2px_0_#2C2C2C] transition-all",
  buttonPrimary: "w-full bg-retro-red text-white font-retro text-lg py-4 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] hover:translate-y-0.5 hover:shadow-none transition-all",
  buttonSecondary: "w-full bg-white text-charcoal font-retro text-lg py-4 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] hover:translate-y-0.5 hover:shadow-none transition-all",
};

const GiftGeneratorPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [selectedTheme, setSelectedTheme] = useState("pixel");
  const [contentType, setContentType] = useState("letter");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [riddles, setRiddles] = useState([{ question: "", answer: "" }]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [generatedLink, setGeneratedLink] = useState("");

  // ── Handlers ───────────────────────────────────────────────
  const addRiddle = () => setRiddles([...riddles, { question: "", answer: "" }]);
  
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles([...photoFiles, ...files]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const slug = Math.random().toString(36).substring(2, 11);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    try {
      // 1. Upload Photos if any
      const photoPaths = [];
      for (const file of photoFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${slug}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gift-photos')
          .upload(filePath, file);
        
        if (!uploadError) photoPaths.push(filePath);
      }

      // 2. Save to Database
      const { error } = await supabase.from("gifts").insert({
        unique_slug: slug,
        recipient_name: recipient,
        sender_name: sender,
        theme_id: selectedTheme,
        content_type: contentType,
        custom_message: contentType === "letter" ? message : null,
        riddles: contentType === "riddle" ? riddles : null,
        photo_paths: photoPaths,
        expires_at: expiresAt
      });

      if (error) throw error;
      setGeneratedLink(`${window.location.origin}/g/${slug}`);
      setStep(4);
    } catch (err) {
      alert("Gagal membuat gift: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-md mx-auto">
        
        {/* Header & Progress */}
        {step < 4 && (
          <div className="text-center mb-10">
            <h1 className="font-retro text-4xl text-charcoal mb-4 tracking-tighter">GIFT MAKER</h1>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3].map((s) => (
                <div key={s} className={`h-3 w-12 rounded-full border-2 border-charcoal transition-all ${step >= s ? 'bg-retro-red shadow-[2px_2px_0_#2C2C2C]' : 'bg-white'}`} />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: THEME SELECTION */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className={UI.card}>
                <span className={UI.label}>Pilih Suasana</span>
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedTheme === t.id ? 'bg-butter border-charcoal shadow-[4px_4px_0_#2C2C2C]' : 'bg-white border-charcoal/10 hover:border-charcoal/30'}`}
                    >
                      <div className="w-12 h-12 rounded-lg border-2 border-charcoal flex items-center justify-center text-xl" style={{ background: t.previewBg }}>
                        {t.id === 'pixel' ? '🕹️' : t.id === 'valentine' ? '💖' : t.id === 'cyberpunk' ? '📟' : t.id === 'kraft' ? '📜' : '🌸'}
                      </div>
                      <div className="text-left">
                        <p className="font-retro text-sm uppercase">{t.name}</p>
                        <p className="text-[10px] font-body opacity-50 uppercase">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(1)} className={UI.buttonPrimary}>LANJUTKAN</button>
            </motion.div>
          )}

          {/* STEP 1: RECIPIENT INFO */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className={UI.card}>
                <div className="mb-4">
                  <label className={UI.label}>Untuk Siapa?</label>
                  <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Nama doi..." className={UI.input} />
                </div>
                <div>
                  <label className={UI.label}>Dari Siapa?</label>
                  <input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Nama kamu/anonim..." className={UI.input} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className={UI.buttonSecondary}>BALIK</button>
                <button onClick={() => setStep(2)} disabled={!recipient || !sender} className={UI.buttonPrimary}>LANJUT</button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CONTENT TYPE */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className={UI.card}>
                <span className={UI.label}>Pilih Jenis Konten</span>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setContentType("letter")} className={`p-6 rounded-2xl border-4 text-center transition-all ${contentType === "letter" ? 'bg-pink-light border-charcoal shadow-[4px_4px_0_#2C2C2C]' : 'bg-white border-charcoal/10 opacity-50'}`}>
                    <span className="text-4xl block mb-2">✍️</span>
                    <p className="font-retro">SURAT DEEP TALK</p>
                  </button>
                  <button onClick={() => setContentType("riddle")} className={`p-6 rounded-2xl border-4 text-center transition-all ${contentType === "riddle" ? 'bg-butter border-charcoal shadow-[4px_4px_0_#2C2C2C]' : 'bg-white border-charcoal/10 opacity-50'}`}>
                    <span className="text-4xl block mb-2">🧩</span>
                    <p className="font-retro">TEBAK-TEBAKAN</p>
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className={UI.buttonSecondary}>BALIK</button>
                <button onClick={() => setStep(3)} className={UI.buttonPrimary}>LANJUT</button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FINAL CONTENT */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className={UI.card}>
                {contentType === "letter" ? (
                  <div>
                    <label className={UI.label}>Tulis Pesanmu</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className={UI.input} placeholder="Tulis ungkapan perasaanmu di sini..." />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                    {riddles.map((r, i) => (
                      <div key={i} className="p-4 bg-cream/50 border-2 border-charcoal rounded-xl">
                        <p className="font-retro text-[10px] mb-2">SOAL #{i+1}</p>
                        <input value={r.question} onChange={(e) => {
                          const newR = [...riddles];
                          newR[i].question = e.target.value;
                          setRiddles(newR);
                        }} placeholder="Pertanyaan..." className={`${UI.input} mb-2`} />
                        <input value={r.answer} onChange={(e) => {
                          const newR = [...riddles];
                          newR[i].answer = e.target.value;
                          setRiddles(newR);
                        }} placeholder="Jawaban..." className={UI.input} />
                      </div>
                    ))}
                    <button onClick={addRiddle} className="w-full py-2 border-2 border-dashed border-charcoal rounded-xl font-retro text-[10px] hover:bg-butter transition-all">+ TAMBAH SOAL</button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t-2 border-charcoal/10">
                  <label className={UI.label}>Upload Foto ({photoFiles.length})</label>
                  <label className="w-full flex flex-col items-center justify-center py-6 bg-cream border-2 border-dashed border-charcoal rounded-2xl cursor-pointer hover:bg-white transition-all">
                    <span className="text-2xl mb-1">📸</span>
                    <span className="text-[10px] font-mono text-charcoal/40 uppercase">Klik untuk tambah foto</span>
                    <input type="file" multiple onChange={handlePhotoChange} className="hidden" accept="image/*" />
                  </label>
                  {photoFiles.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                      {photoFiles.map((file, i) => (
                        <div key={i} className="w-12 h-12 flex-shrink-0 border-2 border-charcoal rounded-lg overflow-hidden relative">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button onClick={() => setPhotoFiles(photoFiles.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-retro-red text-white text-[8px] px-1">X</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className={UI.buttonSecondary}>BALIK</button>
                <button onClick={handleGenerate} disabled={loading} className={UI.buttonPrimary}>{loading ? "PROSES..." : "BUAT KADO!"}</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div key="s4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className={UI.card}>
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="font-retro text-2xl mb-2">Kado Siap!</h2>
                <p className="font-body text-xs text-charcoal/60 mb-6 uppercase tracking-widest">Bagikan link ini ke dia. Aktif selama 24 jam.</p>
                <div className="bg-cream border-2 border-charcoal p-3 rounded-xl mb-6 break-all font-mono text-xs text-retro-red select-all">
                  {generatedLink}
                </div>
                <button onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  alert("Link disalin!");
                }} className={UI.buttonPrimary}>SALIN LINK</button>
              </div>
              <button onClick={() => window.location.reload()} className="font-retro text-xs text-charcoal/40 hover:text-charcoal underline">BUAT LAGI</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GiftGeneratorPage;