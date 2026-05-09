import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle Login / Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        // PROSES LOGIN
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // RAHASIA ANTI-TENDANG: Paksa browser pindah secara fisik biar data profil sempat ke-load
        window.location.href = "/admin"; 
        
      } else {
        // PROSES BUAT AKUN (REGISTER)
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        alert("Akun berhasil dibuat! Silakan klik Login.");
        setIsLogin(true); // Balikin ke mode login
        setPassword("");
      }
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false); // Loading cuma dimatiin kalau error
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-4 font-body relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-light rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-butter rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl border-4 border-charcoal shadow-[8px_8px_0_#2C2C2C] z-10 relative"
      >
        <h2 className="font-retro text-3xl text-charcoal mb-2 text-center uppercase tracking-tighter">
          {isLogin ? "Welcome Back" : "Join Studio"}
        </h2>
        <p className="font-mono text-xs text-charcoal/50 text-center mb-8 uppercase tracking-widest">
          {isLogin ? "Login untuk akses dashboard" : "Buat akun admin baru"}
        </p>

        {errorMsg && (
          <div className="bg-retro-red/10 border-2 border-retro-red text-retro-red p-3 rounded-xl mb-6 font-mono text-[10px] uppercase font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-mono text-[10px] uppercase text-charcoal/60 block mb-2 font-bold">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fryssia.com"
              className="w-full bg-cream border-2 border-charcoal rounded-xl p-4 text-sm font-body focus:border-retro-red outline-none transition-all shadow-[2px_2px_0_#2C2C2C]"
            />
          </div>
          
          <div>
            <label className="font-mono text-[10px] uppercase text-charcoal/60 block mb-2 font-bold">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-cream border-2 border-charcoal rounded-xl p-4 text-sm font-body focus:border-retro-red outline-none transition-all shadow-[2px_2px_0_#2C2C2C]"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-retro-red text-white font-retro text-xl py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[4px_4px_0_#2C2C2C] mt-4 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : (isLogin ? "LOGIN MASUK" : "DAFTAR AKUN")}
          </button>
        </form>

        <div className="mt-8 text-center border-t-2 border-charcoal/10 pt-6">
          <p className="font-mono text-xs text-charcoal/60">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          </p>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            type="button"
            className="font-retro text-sm text-retro-red mt-2 hover:underline decoration-2 underline-offset-4"
          >
            {isLogin ? "Buat Akun Baru" : "Login ke Akun Lama"}
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;