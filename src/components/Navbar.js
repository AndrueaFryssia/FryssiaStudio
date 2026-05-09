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
      
      // Bersihin storage & paksa pindah ke home
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const baseLinks = [
    { to: "/", label: "Home", icon: "✦" },
    { to: "/photobooth", label: "Photobooth", icon: "◉" },
    { to: "/gift", label: "Web Gift", icon: "◈" },
    { to: "/inbox", label: "NGL", icon: "◎" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-cream/95 backdrop-blur-sm border-b-2 border-charcoal">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-retro-red rounded-xl border-2 border-charcoal shadow-clay-sm flex items-center justify-center">
              <span className="text-white font-retro text-sm leading-none">F</span>
            </div>
            <span className="font-retro text-xl text-charcoal hidden sm:block">FryssiaStudio</span>
          </Link>

          {/* Desktop Links (Hidden di Mobile) */}
          <div className="hidden md:flex items-center gap-1">
            {baseLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-xl font-body font-medium text-sm border-2 transition-all 
                  ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to)) ? "bg-retro-red text-white border-charcoal shadow-clay-sm" : "border-transparent hover:border-charcoal text-charcoal/70"}`}
              >
                <span className="text-[10px] mr-1.5 opacity-60">{icon}</span>{label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="px-4 py-2 rounded-xl bg-charcoal text-butter text-sm font-bold border-2 border-charcoal ml-1 shadow-clay-sm">
                Admin
              </Link>
            )}
          </div>

          {/* Auth & Mobile Toggle Section */}
          <div className="flex items-center gap-2 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 clay-btn py-2 px-3 bg-white text-sm cursor-pointer z-[110]"
                >
                  <img
                    src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.email}`}
                    className="w-6 h-6 rounded-full border border-charcoal"
                    alt="avatar"
                  />
                  <span className="hidden sm:block font-bold">{profile?.full_name?.split(" ")[0] || "User"}</span>
                  <span className="text-[10px]">▾</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-charcoal rounded-xl shadow-[4px_4px_0_#2C2C2C] z-[120] overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-butter border-b-2 border-charcoal">
                        <p className="font-mono text-[9px] uppercase opacity-50">Email</p>
                        <p className="text-xs font-bold truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-retro-red font-bold hover:bg-pink-light transition-colors cursor-pointer"
                      >
                        Sign Out →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="clay-btn bg-retro-red text-white text-sm py-2 px-6 shadow-clay-sm">Login</Link>
            )}

            {/* Tombol Hamburger (Cuma Muncul di Mobile) */}
            <button 
              className="md:hidden clay-btn-secondary py-2 px-3 text-sm ml-1" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "≡"}
            </button>
          </div>
        </div>

        {/* Dropdown Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 w-full border-b-2 border-charcoal bg-butter overflow-hidden z-[90] shadow-lg"
            >
              <div className="p-4 flex flex-col gap-2">
                {baseLinks.map(({ to, label, icon }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body font-medium text-sm border-2 border-charcoal shadow-clay-sm
                      ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to)) ? "bg-retro-red text-white" : "bg-white text-charcoal"}`}
                    onClick={() => setMenuOpen(false)}>
                    <span className="text-xs opacity-50">{icon}</span>{label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-body font-medium text-sm border-2 border-charcoal bg-charcoal text-butter shadow-clay-sm" onClick={() => setMenuOpen(false)}>
                    <span className="text-xs opacity-50">◆</span> Admin Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Navigasi Bawah (Bottom Bar) Khusus Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] md:hidden pb-safe">
        <div className="bg-butter/95 backdrop-blur-sm border-t-2 border-charcoal px-2 py-2 flex justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          {baseLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all
                ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to)) ? "text-retro-red scale-110" : "text-charcoal/40"}`}
            >
              <span className="text-lg font-bold">{icon}</span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wide">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;