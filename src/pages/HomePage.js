import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// ============================================================================
// INSTRUKSI PENTING BUAT LO, NDA:
// Taruh 3 file foto strip lo (ccccc.jpg, Red Playful..., dll) 
// ke dalam folder: public/images/samples/
// Biar kodingan di bawah ini bisa manggil fotonya.
// ============================================================================

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
});

// Bentuk Retro Statis (Ringan, ga bikin ngelag)
const RetroGraphic = ({ type, className }) => {
  const shapes = {
    star: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" />
      </svg>
    ),
    circle: <div className="rounded-full border-4 border-charcoal" />,
    box: <div className="border-4 border-charcoal shadow-[4px_4px_0_#2C2C2C]" />,
  };
  return <div className={`absolute pointer-events-none ${className}`}>{shapes[type]}</div>;
};

// Komponen Icon buat Card (0% Emoji)
const FeatureIcon = ({ type }) => {
  const icons = {
    camera: <div className="w-14 h-14 rounded-2xl border-4 border-charcoal flex items-center justify-center bg-white shadow-[4px_4px_0_#2C2C2C]"><div className="w-5 h-5 rounded-full border-4 border-charcoal bg-retro-red" /></div>,
    gift: <div className="w-14 h-14 border-4 border-charcoal flex items-center justify-center bg-pink-light shadow-[4px_4px_0_#2C2C2C] relative"><div className="w-full h-2 bg-charcoal absolute" /><div className="w-2 h-full bg-charcoal absolute" /></div>,
    mail: <div className="w-14 h-11 border-4 border-charcoal bg-butter shadow-[4px_4px_0_#2C2C2C] relative overflow-hidden"><div className="absolute w-20 h-1 border-t-4 border-charcoal top-0 left-[-5px] rotate-[28deg] transform origin-top-left" /><div className="absolute w-20 h-1 border-t-4 border-charcoal top-0 right-[-5px] -rotate-[28deg] transform origin-top-right" /></div>,
  };
  return icons[type];
};

// ============================================================================
// KOMPONEN: PHOTOBOOTH STRIP (Pake Sistem Invisible Spacer biar PAS)
// ============================================================================
const PhotoboothStrip = ({ imageUrl, className }) => (
  <div 
    className={`relative group clay-card overflow-hidden border-2 border-charcoal shadow-[8px_8px_0_#2C2C2C] bg-white transition-transform duration-300 hover:scale-105 ${className}`}
    style={{ width: "130px" }} // Lebar statis biar rapi
  >
    {/* 1. LAYER BAWAH (Spacer): Maksa container punya rasio sesuai foto asli */}
    <img 
      src={imageUrl} 
      alt="spacer" 
      className="w-full h-auto visibility-hidden block pointer-events-none" 
      aria-hidden="true"
    />
    
    {/* 2. LAYER ATAS (Real Image): Ditumpuk pas di atas spacer */}
    <img 
      src={imageUrl} 
      alt="Photobooth Strip" 
      className="absolute inset-0 w-full h-full object-fill z-10" // object-fill biar PNG transparan fit penuh
    />

    {/* Efek Glossy tipis */}
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
  </div>
);

// Halaman Utama
const HomePage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main className="min-h-screen bg-cream overflow-hidden font-body text-charcoal sticker-pattern">
      
      {/* ======= HEADER MARQUEE (Ringan, Ga Ngelag) ======= */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: 200%; animation: marquee 20s linear infinite; }
      `}</style>
      <div className="w-full bg-charcoal text-butter py-2 border-b-4 border-charcoal overflow-hidden z-50 relative">
        <div className="animate-marquee font-retro text-xs tracking-widest whitespace-nowrap uppercase">
          <span className="mx-4">✦ FRYSSIA STUDIO ✦ DIGITAL CREATIVE PLAYGROUND ✦ 100% ESTETIK ✦ JEP้RET MEMORI LO DI SINI ✦ NO RIBET CLUB ✦</span>
          <span className="mx-4">✦ FRYSSIA STUDIO ✦ DIGITAL CREATIVE PLAYGROUND ✦ 100% ESTETIK ✦ JEP้RET MEMORI LO DI SINI ✦ NO RIBET CLUB ✦</span>
        </div>
      </div>

      {/* ======= HERO SECTION (Tampilan Awal) ======= */}
      <section className="relative pt-12 md:pt-20 pb-24 md:pb-32 px-4 lg:px-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Background Graphics (Ganti Emoji) */}
        <RetroGraphic type="star" className="top-10 left-[5%] w-32 h-32 text-charcoal/5 hidden lg:block" />
        <RetroGraphic type="circle" className="bottom-20 left-[35%] w-20 h-20 text-butter/50 hidden md:block rotate-12" />

        {/* KIRI: TEKS & CTA (Copy Refined) */}
        <div className="w-full md:w-1/2 text-center md:text-left z-20">
          <motion.div {...fadeUp(0)} className="inline-block mb-6 border-2 border-charcoal shadow-[4px_4px_0_#D93025] bg-white px-4 py-2">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              ✧ Welcome to Fryssia ✧
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="font-retro text-6xl sm:text-7xl lg:text-9xl leading-[0.85] mb-6 drop-shadow-sm">
            Fryssia
            <br />
            <span className="text-retro-red relative inline-block">
              Studio
              <div className="absolute bottom-1 md:bottom-2 left-0 w-full h-3 md:h-5 bg-butter -z-10 transform -rotate-1" />
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="font-body text-base md:text-lg text-charcoal/80 max-w-md mx-auto md:mx-0 mb-12 leading-relaxed font-medium">
            Tempat jepret memori paling estetik. Dari photobooth ala-ala korea sampe bikin gift web interaktif buat ngucapin ultah atau nembak doi. Gak pake ribet, langsung gas! 📸
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/photobooth" className="bg-charcoal text-white font-retro text-lg px-8 py-4 border-2 border-charcoal shadow-[6px_6px_0_#D93025] hover:translate-y-[2px] transition-all text-center">
              Gas Photobooth
            </Link>
            <Link to="/gift" className="bg-butter text-charcoal font-retro text-lg px-8 py-4 border-2 border-charcoal shadow-[6px_6px_0_#2C2C2C] hover:translate-y-[2px] transition-all text-center">
              Bikin Web Gift
            </Link>
          </motion.div>
        </div>

        {/* KANAN: REAL FOTO STRIP ( Mobile Friendly) */}
        <div className="w-full md:w-1/2 relative h-[420px] md:h-[500px] flex justify-center items-center mt-10 md:mt-0 z-10">
          
          {/* FOTO 1 (Miring Kiri) */}
          <motion.div 
            initial={{ opacity: 0, rotate: -20, x: -80 }}
            animate={{ opacity: 1, rotate: -10, x: isMobile ? -60 : -90, y: isMobile ? 30 : 50 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="absolute z-10"
          >
            {/* directory: public/images/samples/filename.jpg */}
            <PhotoboothStrip imageUrl="/images/samples/Red Playful Friendship Photo Booth Bookmark.jpg" />
          </motion.div>
          
          {/* FOTO 2 (Tengah, Paling Depan) */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, rotate: 0, y: isMobile ? -10 : -30, scale: 1.1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute z-30 shadow-2xl"
          >
            {/* directory: public/images/samples/filename.jpg */}
            <PhotoboothStrip imageUrl="/images/samples/ccccc.jpg" />
          </motion.div>
          
          {/* FOTO 3 (Miring Kanan) */}
          <motion.div 
            initial={{ opacity: 0, rotate: 20, x: 80 }}
            animate={{ opacity: 1, rotate: 8, x: isMobile ? 60 : 90, y: isMobile ? 20 : 40 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="absolute z-20"
          >
            {/* directory: public/images/samples/filename.jpg */}
            <PhotoboothStrip imageUrl="/images/samples/photobooth-sample-1.jpg" />
          </motion.div>
        </div>
      </section>

      {/* ======= MENU SECTION (Pilih Mainan Lo Refined) ======= */}
      <section className="py-24 px-4 bg-charcoal text-butter relative border-t-4 border-retro-red border-b-4 border-charcoal sticker-pattern-dark">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#FFF 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeUp(0)} className="text-center mb-20 flex flex-col items-center gap-2">
            <RetroGraphic type="star" className="relative w-12 h-12 text-retro-red" />
            <h2 className="font-retro text-5xl md:text-6xl mb-2 text-butter tracking-wide">Pilih Mainan Lo</h2>
            <p className="font-mono text-sm tracking-widest text-white/50 uppercase font-bold">Jelajahi Playground Digital Fryssia Studio</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: "camera", title: "Photobooth", tag: "FAVORITE",
                desc: "Jepret foto langsung pake frame-frame estetik ala korea. Hasil HD, fit 100% gak kepotong, siap pamer di feeds!",
                color: "bg-butter text-charcoal", to: "/photobooth",
              },
              {
                icon: "gift", title: "Gift Web",
                desc: "Kejutan ultah, anniversary, atau nembak crush pake web interaktif yang cuma lo yang punya linknya. Bikin doi baper!",
                color: "bg-pink-sweets text-charcoal", to: "/gift",
              },
              {
                icon: "mail", title: "NGL Anonim", tag: "DEMO",
                desc: "Terima pesan rahasia dari siapa aja tanpa ketahuan. Bagikan link NGL-mu dan liat siapa yang peduli!",
                color: "bg-white text-charcoal", to: "/ngl", // Path NGL ditambahkan
              },
            ].map((card, idx) => (
              <motion.div key={card.title} {...fadeUp(0.1 + idx * 0.1)} className="h-full group">
                <Link to={card.to} className="block h-full relative clay-card border-2 border-charcoal shadow-[8px_8px_0_#2C2C2C] group-hover:-translate-y-2 group-hover:shadow-[8px_10px_0_#2C2C2C] transition-all duration-300">
                  <div className={`p-8 md:p-10 ${card.color} h-full flex flex-col`}>
                    {card.tag && (
                      <span className="absolute top-5 right-5 bg-retro-red text-white font-mono text-[11px] font-bold px-3 py-1.5 border-2 border-charcoal z-10 shadow-[2px_2px_0_#2C2C2C]">
                        {card.tag}
                      </span>
                    )}
                    <div className="mb-8"><FeatureIcon type={card.icon} /></div>
                    <h3 className="font-retro text-3xl mb-4 tracking-wider">{card.title}</h3>
                    <p className="font-body text-base opacity-90 leading-relaxed font-medium flex-grow mb-10">{card.desc}</p>
                    <div className="flex items-center gap-3 font-mono text-sm font-bold border-t-2 border-charcoal/10 pt-6 mt-auto">
                      <span>OPEN FEATURE</span>
                      <span className="text-retro-red transform group-hover:translate-x-1.5 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CARA PAKAI (Simplified & Neater) ======= */}
      <section className="py-24 px-4 bg-cream border-b-4 border-charcoal relative">
        <RetroGraphic type="box" className="top-20 right-[10%] w-24 h-24 text-charcoal/5 rotate-12 hidden md:block" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)} className="mb-16">
            <h2 className="font-retro text-5xl md:text-6xl text-charcoal mb-3">Cara Mainnya</h2>
            <p className="font-mono text-charcoal/50 font-bold text-sm">TANPA LOGIN, LANGSUNG GAS!</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: "1", title: "Pilih Fitur", desc: "Pilih Photobooth buat foto atau Gift Web buat kejutan." },
              { step: "2", title: "Custom Suka-Suka", desc: "Masukin nama, ganti warna, tambahin foto, atur frame estetik." },
              { step: "3", title: "Share Hasilnya", desc: "Download fotonya atau bagikan link webnya ke temen lo." },
            ].map(({ step, title, desc }, idx) => (
              <motion.div key={step} {...fadeUp(0.1 + idx * 0.1)} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-charcoal text-butter font-retro text-3xl flex items-center justify-center rounded-full border-4 border-charcoal shadow-[4px_4px_0_#D93025] mb-8 relative">
                  {step}
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-md pointer-events-none" />
                </div>
                <h3 className="font-retro text-2xl text-charcoal mb-4 tracking-wide">{title}</h3>
                <p className="font-body text-base text-charcoal/70 font-medium leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="py-12 px-4 bg-butter border-t-4 border-charcoal text-center sticker-pattern-footer">
        <h2 className="font-retro text-3xl md:text-4xl text-charcoal mb-2 tracking-widest">FRYSSIA STUDIO</h2>
        <p className="font-mono text-xs text-charcoal/80 font-bold tracking-wider mb-6">
          DIGITAL CREATIVE PLAYGROUND · BDG · EST 2026
        </p>
        <p className="font-mono text-[10px] text-charcoal/50 mt-10">
          © {new Date().getFullYear()} DESIGNED & CODED WITH ♡ BY FS ENGINEERS
        </p>
      </footer>
    </main>
  );
};

export default HomePage;
