// src/pages/GiftWebPage.js
// ─────────────────────────────────────────────────────────────
// Router utama: load gift dari Supabase, cek expiry.
// Sekarang murni cuma nge-load data dan melempar ke Theme Component.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

// IMPORT DARI PUSAT KONTROL THEME YANG BARU
import { getThemeConfig as getTheme } from "../components/gift-themes";

// ─────────────────────────────────────────────────────────────
// LOADING VIEW (Tetap Butter & Pink Neo-Brutalism)
// ─────────────────────────────────────────────────────────────
const LoadingView = () => (
  <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-light rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-butter rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0" />
    
    <motion.div
      animate={{ rotate: [0, 90, 180, 270, 360], borderRadius: ["20%", "50%", "20%", "50%", "20%"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-14 h-14 bg-retro-red border-4 border-charcoal shadow-[4px_4px_0_#2C2C2C] mb-8 relative z-10 flex items-center justify-center"
    >
      <span className="text-white text-xl">🎁</span>
    </motion.div>
    
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="font-retro text-2xl text-charcoal tracking-widest relative z-10"
    >
      MEMBUKA KADO...
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// EXPIRED VIEW
// ─────────────────────────────────────────────────────────────
export const ExpiredView = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-md bg-white p-8 rounded-3xl border-4 border-charcoal shadow-[8px_8px_0_#2C2C2C] text-center z-10"
    >
      <div className="w-20 h-20 mx-auto bg-butter border-4 border-charcoal rounded-full flex items-center justify-center shadow-[4px_4px_0_#2C2C2C] mb-6">
        <span className="text-4xl">⌛</span>
      </div>
      
      <h2 className="font-retro text-3xl text-charcoal mb-2 uppercase tracking-tighter">
        Waktu Habis!
      </h2>
      
      <p className="font-mono text-xs text-charcoal/60 mb-8 uppercase tracking-widest leading-relaxed">
        Surat ini hanya bertahan 24 jam dan sekarang sudah hilang menjadi debu kosmik.
      </p>
      
      <Link 
        to="/" 
        className="w-full block bg-retro-red text-white font-retro text-lg py-4 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] hover:translate-y-1 hover:shadow-none transition-all"
      >
        KEMBALI KE BERANDA
      </Link>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// NOT FOUND VIEW
// ─────────────────────────────────────────────────────────────
const NotFoundView = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-md bg-white p-8 rounded-3xl border-4 border-charcoal shadow-[8px_8px_0_#2C2C2C] text-center z-10"
    >
      <div className="w-20 h-20 mx-auto bg-pink-light border-4 border-charcoal rounded-xl flex items-center justify-center shadow-[4px_4px_0_#2C2C2C] mb-6 transform -rotate-6">
        <span className="text-4xl">❓</span>
      </div>
      
      <h2 className="font-retro text-3xl text-charcoal mb-2 uppercase tracking-tighter">
        Tidak Ditemukan
      </h2>
      
      <p className="font-mono text-xs text-charcoal/60 mb-8 uppercase tracking-widest leading-relaxed">
        Sepertinya link yang kamu tuju salah, atau kadonya belum dibuat.
      </p>
      
      <Link 
        to="/" 
        className="w-full block bg-charcoal text-white font-retro text-lg py-4 rounded-xl border-2 border-charcoal shadow-[4px_4px_0_#2C2C2C] hover:translate-y-1 hover:shadow-none transition-all"
      >
        KEMBALI KE BERANDA
      </Link>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const GiftWebPage = () => {
  const { slug }   = useParams();
  const [data, setData]     = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | expired | notfound

  useEffect(() => {
    if (!slug) { setStatus("notfound"); return; }

    const fetchGift = async () => {
      try {
        const { data: gift, error } = await supabase
          .from("gifts")
          .select("*")
          .eq("unique_slug", slug)
          .single();

        if (error || !gift) { setStatus("notfound"); return; }

        // 24-hour check
        const expiresAt = new Date(gift.expires_at).getTime();
        if (Date.now() > expiresAt) { setStatus("expired"); return; }

        setData(gift);
        setStatus("ok");

        // Increment view count
        supabase
          .from("gifts")
          .update({ view_count: (gift.view_count || 0) + 1 })
          .eq("id", gift.id)
          .then(() => {});
      } catch {
        setStatus("notfound");
      }
    };

    fetchGift();
  }, [slug]);

  if (status === "loading")  return <LoadingView />;
  if (status === "expired")  return <ExpiredView />;
  if (status === "notfound" || !data) return <NotFoundView />;

  // ─────────────────────────────────────────────────────────
  // THEME ROUTER (Otomatis milih komponen berdasarkan data)
  // ─────────────────────────────────────────────────────────
  const themeId = data.theme_id || "pixel";
  
  // Ambil komponen dari index.js (Pusat Kontrol)
  const SelectedThemeComponent = THEME_COMPONENTS[themeId];

  // Kalau ternyata ID theme-nya salah atau nggak ada di daftar, fallback ke Pixel
  if (!SelectedThemeComponent) {
    const FallbackTheme = THEME_COMPONENTS["pixel"];
    return <FallbackTheme data={data} />;
  }

  return <SelectedThemeComponent data={data} />;
};

export default GiftWebPage;
