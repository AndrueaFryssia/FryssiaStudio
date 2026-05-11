import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

const Navbar = () => {
  const { user, profile, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUserMenuOpen(false);
      
      // Bersihin storage & paksa pindah ke home secara halus
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
      window.location.reload(); // Refresh sekali buat pastiin state auth beneran bersih
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const baseLinks = [
    { to: "/", label: "Home", icon: "✦" },
    { to: "/photobooth", label: "Photobooth", icon: "📸" },
    { to: "/gift", label: "Web Gift", icon: "🎁" },
    { to: "/inbox", label: "NGL", icon: "💬" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b-[3px] border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-pink-500 rounded-xl border-[3px] border-slate-800 shadow-[3px_3px_0_#1e293b] flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-retro text-lg leading-none mt-1">F</span>
            </div>
            <span className="font-retro text-xl text-slate-900 hidden sm:block tracking-tighter">
              FRYSSIA<span className="text-pink-500">STUDIO</span>
            </span>
          </Link>

          {/* Desktop Links (Modern Minimalist) */}
          <div className="hidden md:flex items-center gap-2">
            {baseLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-5 py-2 rounded-lg font-mono text-[11px] font-bold uppercase tracking-widest transition-all border-[3px]
                  ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to)) 
                    ? "bg-pink-100 text-slate-900 border-slate-800 shadow-[3px_3px_0_#1e293b]" 
                    : "bg-transparent text-slate-500 border-transparent hover:text-slate-800 hover:bg-pink-50"}`}
              >
                {label}
              </Link>
            ))}
            
            {isAdmin && (
              <Link to="/admin" className="px-5 py-2 rounded-lg bg-slate-800 text-white text-[11px] font-bold font-mono uppercase tracking-widest border-[3px] border-slate-800 ml-2 shadow-[3px_3px_0_#f472b6]">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth & Toggle Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 border-[3px] border-slate-800 py-1.5 px-3 bg-white rounded-xl shadow-[3px_3px_0_#1e293b] hover:translate-y-[1px] transition-all cursor-pointer"
                >
                  <img
                    src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.email}`}
                    className="w-7 h-7 rounded-lg border-2 border-slate-800"
                    alt="avatar"
                  />
                  <span className="hidden sm:block font-mono text-[11px] font-bold uppercase tracking-tight text-slate-800">
                    {profile?.full_name?.split(" ")[0] || "Admin"}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-3 w-52 bg-white border-[3px] border-slate-800 rounded-xl shadow-[6px_6px_0_#1e293b] z-[120] overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-pink-50 border-b-[3px] border-slate-800">
                        <p className="font-mono text-[9px] uppercase font-bold text-slate-400">Account Session</p>
                        <p className="text-[11px] font-bold truncate text-slate-800">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-[11px] font-mono uppercase tracking-widest text-pink-600 font-bold hover:bg-pink-100 transition-colors cursor-pointer"
                      >
                        Log Out Account →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="bg-pink-500 text-white font-mono text-[11px] font-bold uppercase tracking-widest py-2.5 px-6 border-[3px] border-slate-800 shadow-[3px_3px_0_#1e293b] rounded-xl">
                Login
              </Link>
            )}

            {/* Hamburger (Mobile) */}
            <button 
              className="md:hidden border-[3px] border-slate-800 py-2 px-3 rounded-xl bg-white text-slate-800 font-bold" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "MENU"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden absolute top-full left-0 w-full border-b-[3px] border-slate-800 bg-white overflow-hidden z-[90]"
            >
              <div className="p-4 flex flex-col gap-2">
                {baseLinks.map(({ to, label }) => (
                  <Link key={to} to={to}
                    className={`px-4 py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-widest border-[3px] border-slate-800 shadow-[3px_3px_0_#1e293b]
                      ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to)) 
                        ? "bg-pink-500 text-white" 
                        : "bg-white text-slate-800"}`}
                    onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className="px-4 py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-widest border-[3px] border-slate-800 bg-slate-800 text-white shadow-[3px_3px_0_#f472b6]" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom Bar (Mobile Only - Clean Pink Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] md:hidden pb-safe">
        <div className="bg-white/90 backdrop-blur-md border-t-[3px] border-slate-800 px-2 py-3 flex justify-around shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
          {baseLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-1.5 transition-all
                ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to)) 
                  ? "text-pink-500 scale-110" 
                  : "text-slate-400"}`}
            >
              <span className="text-xl">{icon}</span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
