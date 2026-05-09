import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

const NglPage = () => {
  const { slug } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, ngl_enabled, ngl_slug")
          .eq("ngl_slug", slug)
          .single();

        if (!error && data) setRecipient(data);
      } catch (err) {
        console.error("Gagal fetch recipient:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchRecipient();
  }, [slug]);

  const handleSend = async () => {
    if (!message.trim() || message.length < 5) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("anonymous_messages").insert({
        recipient_id: recipient.id,
        message: message.trim(),
        sender_hint: hint.trim() || null,
      });
      if (!error) setSent(true);
      else throw error;
    } catch (err) {
      console.error(err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-butter">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity }} className="text-5xl">
          💌
        </motion.div>
      </div>
    );
  }

  if (!recipient || !recipient.ngl_enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="clay-card bg-butter p-8 max-w-sm text-center">
          <div className="text-5xl mb-4">😶</div>
          <h2 className="font-retro text-2xl">NGL Tidak Ditemukan</h2>
          <p className="font-body text-sm text-charcoal/60 mt-2">
            Link ini tidak aktif atau belum dibuat.
          </p>
          <Link to="/" className="clay-btn-primary mt-4 inline-block px-6 py-2">
            Ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // AMANIN NAMA KOSONG BIAR GAK CRASH
  const displayName = recipient.full_name || "Seseorang";
  const firstName = recipient.full_name ? recipient.full_name.split(" ")[0] : "dia";

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Floating emojis */}
      {["💌", "✉️", "💭", "🤫", "❓"].map((e, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl pointer-events-none select-none opacity-20"
          style={{ top: `${15 + i * 16}%`, left: i % 2 === 0 ? "5%" : "85%" }}
          animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        >
          {e}
        </motion.div>
      ))}

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Profile Card */}
              <div className="clay-card bg-butter p-6 mb-6 text-center border-2 border-charcoal shadow-clay">
                <img
                  src={recipient.avatar_url || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${recipient.ngl_slug}`}
                  alt="avatar"
                  className="w-20 h-20 rounded-full border-4 border-charcoal mx-auto mb-3 shadow-clay-sm"
                />
                <h2 className="font-retro text-3xl text-charcoal">{displayName}</h2>
                <p className="font-mono text-xs text-charcoal/50 mt-1">
                  @{recipient.ngl_slug}
                </p>
                <div className="mt-3 inline-block">
                  <span className="retro-tag bg-pink-sweets text-charcoal text-[10px] font-bold px-3 py-1 rounded-full border-2 border-charcoal shadow-clay-sm">
                    💌 Kirim Pesan Anonim
                  </span>
                </div>
              </div>

              {/* Message Form */}
              <div className="clay-card bg-white p-6 border-2 border-charcoal shadow-clay">
                <h3 className="font-retro text-xl mb-4">
                  Apa yang mau kamu sampaikan ke <span className="text-retro-red">{firstName}</span>?
                </h3>

                <div className="relative mb-4">
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setCharCount(e.target.value.length);
                    }}
                    maxLength={500}
                    rows={5}
                    placeholder="Curhat, puji, kritik, atau apapun yang ingin kamu sampaikan... Dijamin anonim! 🤫"
                    className="w-full bg-cream border-2 border-charcoal rounded-xl p-3 text-sm font-body focus:border-retro-red outline-none transition-all shadow-[inset_2px_2px_0_rgba(0,0,0,0.05)] resize-none"
                  />
                  <span className={`absolute bottom-3 right-3 font-mono text-[10px] ${charCount > 450 ? "text-retro-red font-bold" : "text-charcoal/30"}`}>
                    {charCount}/500
                  </span>
                </div>

                {/* Optional hint */}
                <div className="mb-5">
                  <label className="font-mono text-[11px] text-charcoal/50 block mb-1 font-bold uppercase">
                    Clue siapa kamu (opsional)
                  </label>
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="Contoh: 'anak TJK sebelah' atau kosongkan..."
                    maxLength={50}
                    className="w-full bg-cream border-2 border-charcoal rounded-xl p-2.5 text-xs font-body focus:border-retro-red outline-none shadow-[2px_2px_0_#2C2C2C]"
                  />
                </div>

                {/* Tone selection */}
                <div className="mb-5">
                  <p className="font-mono text-[11px] text-charcoal/50 mb-2 font-bold uppercase">Pilih tone pesan:</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { emoji: "😍", label: "Kagum" },
                      { emoji: "🤣", label: "Lucu" },
                      { emoji: "💬", label: "Serius" },
                      { emoji: "🌸", label: "Manis" },
                      { emoji: "🔥", label: "Jujur" },
                    ].map(({ emoji, label }) => (
                      <button
                        key={label}
                        onClick={() => setMessage((prev) => `${emoji} ${prev}`)}
                        className="bg-butter border-2 border-charcoal rounded-lg text-xs py-1.5 px-3 hover:bg-pink-light shadow-[2px_2px_0_#2C2C2C] active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  disabled={loading || message.trim().length < 5}
                  className="w-full bg-retro-red text-white font-retro text-lg py-3 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500 active:translate-y-1 active:shadow-none transition-all"
                >
                  {loading ? "MENGIRIM..." : "🚀 KIRIM ANONIM!"}
                </button>

                <p className="font-mono text-[9px] text-charcoal/40 text-center mt-4 uppercase tracking-widest">
                  🔒 Identitasmu 100% anonim
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="clay-card bg-butter p-10 text-center border-2 border-charcoal shadow-[8px_8px_0_#2C2C2C]"
            >
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [-10, 10, -10] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-7xl mb-6 inline-block"
              >
                💌
              </motion.div>
              <h2 className="font-retro text-3xl text-charcoal mb-2">Terkirim!</h2>
              <p className="font-body text-charcoal/70 mb-8 text-sm">
                Pesanmu sudah meluncur ke <strong>{firstName}</strong>.<br />
                Kira-kira dia bakal sadar gak ya itu dari kamu? 🤫
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); setMessage(""); setHint(""); setCharCount(0); }}
                  className="w-full bg-retro-red text-white font-retro text-sm py-3 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] hover:bg-red-500 active:translate-y-1 active:shadow-none transition-all"
                >
                  💌 Kirim Pesan Lagi
                </button>
                <Link to="/" className="w-full bg-white text-charcoal font-retro text-sm py-3 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] hover:bg-cream active:translate-y-1 active:shadow-none transition-all block text-center">
                  🏠 Ke Beranda
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default NglPage;