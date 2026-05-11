import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// ============================================================================
// FOTO STRIPS SAMPLES
// Pastikan file gambar ada di folder: public/images/samples/
// ============================================================================

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
});

// Bentuk Grafis Minimalis
const MinimalGraphic = ({ type, className }) => {
  const shapes = {
    star: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" />
      </svg>
    ),
    circle: <div className="rounded-full border-[3px] border-slate-800" />,
    box: <div className="border-[3px] border-slate-800 shadow-[4px_4px_0_#1e293b]" />,
  };
  return <div className={`absolute pointer-events-none ${className}`}>{shapes[type]}</div>;
};

// Komponen Icon Clean
const FeatureIcon = ({ type }) => {
  const icons = {
    camera: (
      <div className="w-14 h-14 rounded-2xl border-[3px] border-slate-800 flex items-center justify-center bg-white shadow-[4px_4px_0_#1e293b]">
        <div className="w-5 h-5 rounded-full border-[3px] border-slate-800 bg-pink-400" />
      </div>
    ),
    gift: (
      <div className="w-14 h-14 border-[3px] border-slate-800 flex items-center justify-center bg-pink-100 shadow-[4px_4px_0_#1e293b] relative">
        <div className="w-full h-1.5 bg-slate-800 absolute" />
        <div className="w-1.5 h-full bg-slate-800 absolute" />
      </div>
    ),
    mail: (
      <div className="w-14 h-11 border-[3px] border-slate-800 bg-pink-50 shadow-[4px_4px_0_#1e293b] relative overflow-hidden">
        <div className="absolute w-20 h-1 border-t-[3px] border-slate-800 top-0 left-[-5px] rotate-[28deg] transform origin-top-left" />
        <div className="absolute w-20 h-1 border-t-[3px] border-slate-800 top-0 right-[-5px] -rotate-[28deg] transform origin-top-right" />
      </div>
    ),
  };
  return icons[type];
};

// ============================================================================
// KOMPONEN: PHOTOBOOTH STRIP
// ============================================================================
const PhotoboothStrip = ({ imageUrl, className }) => (
  <div 
    className={`relative group overflow-hidden border-2 border-slate-800 shadow-[6px_6px_0_#1e293b] bg-white transition-transform duration-300 hover:scale-105 ${className}`}
    style={{ width: "130px" }} 
  >
    <img 
      src={imageUrl} 
      alt="spacer" 
      className="w-full h-auto visibility-hidden block pointer-events-none opacity-0" 
      aria-hidden="true"
    />
    <img 
      src={imageUrl} 
      alt="Photobooth Strip Sample" 
      className="absolute inset-0 w-full h-full object-fill z-10" 
    />
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
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
    <main className="min-h-screen bg-white overflow-hidden font-body text-slate-800">
      
      {/* ======= HEADER MARQUEE ======= */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: 200%; animation: marquee 25s linear infinite; }
      `}</style>
      <div className="w-full bg-pink-50 text-slate-800 py-2 border-b-[3px] border-slate-800 overflow-hidden z-50 relative">
        <div className="animate-marquee font-mono text-xs tracking-widest whitespace-nowrap uppercase font-bold">
          <span className="mx-4">✦ FRYSSIA STUDIO ✦ DIGITAL CREATIVE SPACE ✦ MINIMALIST DESIGN ✦ CAPTURE YOUR MOMENTS ✦ SEAMLESS EXPERIENCE ✦</span>
          <span className="mx-4">✦ FRYSSIA STUDIO ✦ DIGITAL CREATIVE SPACE ✦ MINIMALIST DESIGN ✦ CAPTURE YOUR MOMENTS ✦ SEAMLESS EXPERIENCE ✦</span>
        </div>
      </div>

      {/* ======= HERO SECTION ======= */}
      <section className="relative pt-12 md:pt-24 pb-24 md:pb-32 px-4 lg:px-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Background Graphics */}
        <MinimalGraphic type="star" className="top-10 left-[5%] w-24 h-24 text-pink-100 hidden lg:block" />
        <MinimalGraphic type="circle" className="bottom-20 left-[35%] w-16 h-16 text-pink-50 hidden md:block rotate-12" />

        {/* KIRI: TEKS & CTA */}
        <div className="w-full md:w-1/2 text-center md:text-left z-20">
          <motion.div {...fadeUp(0)} className="inline-block mb-6 border-2 border-slate-800 shadow-[4px_4px_0_#f472b6] bg-white px-4 py-2">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-slate-800">
              ✧ Lets Make a Memory ✧
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="font-retro text-6xl sm:text-7xl lg:text-8xl leading-[0.9] mb-6 drop-shadow-sm text-slate-900">
            Fryssia
            <br />
            <span className="text-pink-500 relative inline-block mt-2">
              Studio
              <div className="absolute bottom-1 md:bottom-2 left-0 w-full h-3 md:h-4 bg-pink-100 -z-10 transform -rotate-1" />
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="font-body text-base md:text-lg text-slate-600 max-w-md mx-auto md:mx-0 mb-10 leading-relaxed">
            Platform kreatif digital untuk mengabadikan momen dan mengirimkan hadiah virtual. Dirancang dengan pendekatan minimalis untuk memberikan pengalaman interaktif yang berkesan.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/photobooth" className="bg-pink-500 text-white font-mono font-bold text-sm tracking-wider uppercase px-8 py-4 border-[3px] border-slate-800 shadow-[4px_4px_0_#1e293b] hover:translate-y-[2px] transition-all text-center">
              Buka Photobooth
            </Link>
            <Link to="/gift" className="bg-white text-slate-800 font-mono font-bold text-sm tracking-wider uppercase px-8 py-4 border-[3px] border-slate-800 shadow-[4px_4px_0_#1e293b] hover:translate-y-[2px] transition-all text-center">
              Buat Gift Web
            </Link>
          </motion.div>
        </div>

        {/* KANAN: FOTO STRIP */}
        <div className="w-full md:w-1/2 relative h-[420px] md:h-[500px] flex justify-center items-center mt-10 md:mt-0 z-10">
          
          <motion.div 
            initial={{ opacity: 0, rotate: -15, x: -60 }}
            animate={{ opacity: 1, rotate: -8, x: isMobile ? -50 : -80, y: isMobile ? 20 : 40 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="absolute z-10"
          >
            <PhotoboothStrip imageUrl="/images/samples/photobooth-sample-1.jpg" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, rotate: 0, y: isMobile ? -10 : -20, scale: 1.05 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute z-30 shadow-xl"
          >
            <PhotoboothStrip imageUrl="/images/samples/ccccc.jpg" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, rotate: 15, x: 60 }}
            animate={{ opacity: 1, rotate: 6, x: isMobile ? 50 : 80, y: isMobile ? 15 : 30 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="absolute z-20"
          >
            <PhotoboothStrip imageUrl="/images/samples/photobooth-sample-1.jpg" />
          </motion.div>
        </div>
      </section>

      {/* ======= MENU SECTION ======= */}
      <section className="py-24 px-4 bg-pink-50 relative border-t-[3px] border-slate-800 border-b-[3px] border-slate-800">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeUp(0)} className="text-center mb-16 flex flex-col items-center gap-3">
            <h2 className="font-retro text-4xl md:text-5xl text-slate-900 tracking-wide">Jelajahi Fitur</h2>
            <p className="font-mono text-xs tracking-widest text-slate-500 uppercase font-semibold">
              Koleksi Layanan Digital Kami
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "camera", title: "Photobooth", tag: "POPULAR",
                desc: "Abadikan momen dengan berbagai pilihan bingkai minimalis. Hasil resolusi tinggi yang siap diunduh dan dibagikan.",
                color: "bg-white", to: "/photobooth",
              },
              {
                icon: "gift", title: "Gift Web",
                desc: "Kirimkan pesan dan hadiah virtual interaktif. Dirancang khusus untuk memberikan pengalaman yang personal dan eksklusif.",
                color: "bg-pink-100", to: "/gift",
              },
              {
                icon: "mail", title: "Anonymous Mail", tag: "NEW",
                desc: "Terima pesan secara aman tanpa identitas. Bagikan tautan profil Anda dan biarkan mereka bercerita dengan bebas.",
                color: "bg-white", to: "/ngl",
              },
            ].map((card, idx) => (
              <motion.div key={card.title} {...fadeUp(0.1 + idx * 0.1)} className="h-full group">
                <Link to={card.to} className="block h-full relative bg-white border-[3px] border-slate-800 shadow-[6px_6px_0_#1e293b] group-hover:-translate-y-1.5 group-hover:shadow-[6px_8px_0_#1e293b] transition-all duration-300">
                  <div className={`p-8 md:p-10 ${card.color} h-full flex flex-col`}>
                    {card.tag && (
                      <span className="absolute top-5 right-5 bg-slate-800 text-white font-mono text-[10px] font-bold px-3 py-1 tracking-wider uppercase">
                        {card.tag}
                      </span>
                    )}
                    <div className="mb-8"><FeatureIcon type={card.icon} /></div>
                    <h3 className="font-retro text-2xl mb-3 text-slate-900 tracking-wide">{card.title}</h3>
                    <p className="font-body text-sm text-slate-600 leading-relaxed flex-grow mb-8">{card.desc}</p>
                    <div className="flex items-center gap-3 font-mono text-[11px] font-bold border-t-2 border-slate-200 pt-5 mt-auto text-slate-800">
                      <span className="uppercase tracking-widest">Akses Fitur</span>
                      <span className="text-pink-500 transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CARA PENGGUNAAN ======= */}
      <section className="py-24 px-4 bg-white border-b-[3px] border-slate-800 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)} className="mb-16">
            <h2 className="font-retro text-4xl md:text-5xl text-slate-900 mb-3">Cara Penggunaan</h2>
            <p className="font-mono text-slate-500 font-semibold tracking-widest text-[11px] uppercase">
              Akses Langsung Tanpa Registrasi
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: "01", title: "Pilih Layanan", desc: "Tentukan layanan yang ingin Anda gunakan, mulai dari Photobooth hingga Gift Web." },
              { step: "02", title: "Personalisasi", desc: "Sesuaikan nama, warna, bingkai, dan pesan sesuai dengan preferensi Anda." },
              { step: "03", title: "Simpan & Bagikan", desc: "Unduh hasil akhir atau salin tautan untuk dibagikan kepada rekan Anda." },
            ].map(({ step, title, desc }, idx) => (
              <motion.div key={step} {...fadeUp(0.1 + idx * 0.1)} className="flex flex-col items-center">
                <div className="font-mono text-4xl text-pink-300 font-bold mb-4">
                  {step}
                </div>
                <h3 className="font-retro text-xl text-slate-900 mb-3 tracking-wide">{title}</h3>
                <p className="font-body text-sm text-slate-500 leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="py-12 px-4 bg-pink-50 text-center">
        <h2 className="font-retro text-2xl text-slate-900 mb-2 tracking-widest">FRYSSIA STUDIO</h2>
        <p className="font-mono text-[10px] text-slate-500 font-bold tracking-widest mb-8">
          DIGITAL CREATIVE SPACE · GRT · EST 2026
        </p>
        <p className="font-mono text-[10px] text-slate-400 mt-8">
          © {new Date().getFullYear()} DESIGNED & ENGINEERED BY @ANMWLD
        </p>
      </footer>
    </main>
  );
};

export default HomePage;
