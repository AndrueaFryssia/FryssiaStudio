import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true; // Pasang pengaman biar state ga bocor (Memory Leak)

    const fetchProfile = async (userId) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (mounted && !error) setProfile(data);
        if (error) console.error("Error dari DB:", error);
      } catch (err) {
        console.error("Gagal narik profil:", err);
      }
    };

    // 1. Fungsi Cek Sesi Pertama Kali Buka Web
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      
      if (mounted) setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      }
      
      if (mounted) setLoading(false); // Loading dimatiin cuma kalau proses ini beres
    };

    initAuth();

    // 2. Fungsi Cek Pas User Mencet Login / Logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Abaikan INITIAL_SESSION karena udah diurus sama initAuth di atas
      if (event === 'INITIAL_SESSION') return;

      if (mounted) setLoading(true); // Nyalain loading pas proses ganti akun
      
      const currentUser = session?.user ?? null;
      if (mounted) setUser(currentUser);

      if (currentUser) {
        // Kalau Login
        await fetchProfile(currentUser.id);
      } else {
        // Kalau Logout
        if (mounted) setProfile(null);
      }

      if (mounted) setLoading(false); // Matiin loading pas prosesnya tuntas
    });

    // Bersihin listener kalau user tutup webnya
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const isAdmin = profile?.is_admin === true;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
