import { motion } from "framer-motion";

const DownloadPreview = ({ finalImage, resetPhotobooth, setStep }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
      <div className="clay-card bg-butter p-8 max-w-md mx-auto mb-8">
        <h2 className="font-retro text-4xl text-charcoal mb-2">Siap Download!</h2>
        <p className="font-body text-charcoal/60 mb-6 text-sm">Foto resolusi tinggi kamu sudah siap.</p>
        
        <img src={finalImage} alt="Final Photobooth" className="w-full rounded-xl border-2 border-charcoal shadow-lg mb-6" />

        <div className="space-y-3">
          {/* Tombol Native Download (Gak perlu logic ribet lagi!) */}
          <a href={finalImage} download={`fryssia-${Date.now()}.png`} className="block w-full">
            <button className="clay-btn bg-retro-red text-white w-full py-4 text-lg">Simpan ke HP/Laptop</button>
          </a>
          
          <button onClick={() => setStep("edit")} className="clay-btn bg-white w-full py-3 text-sm">← Kembali Edit</button>
          <button onClick={resetPhotobooth} className="clay-btn bg-pink-light w-full py-3 text-sm">Bikin Foto Baru</button>
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadPreview;