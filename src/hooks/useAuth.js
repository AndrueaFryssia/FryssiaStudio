import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // Loading cuma nyala PAS AWAL BANGET web dibuka
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fungsi khusus buat narik data admin
    const fetchProfile = async (userId) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (error) throw error;
        if (mounted) setProfile(data);
      } catch (err) {
        console.error("Gagal narik profil:", err.message);
      }
    };

    // 1. Fungsi pas web pertama kali dimuat
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const currentUser = session?.user ?? null;
        if (mounted) setUser(currentUser);

        // Tunggu profil selesai ditarik kalau ada user
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (error) {
        console.error("Auth init error:", error.message);
      } finally {
        // THE MAGIC TRICK: Pake 'finally' ngasih garansi 100% loading bakal dimatiin,
        // entah itu error, sukses, ataupun datanya kosong.
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // 2. Pantau event Login / Logout tanpa bikin freeze
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Kita HAPUS setLoading(true) di sini biar app ga pernah freeze mendadak
      
      const currentUser = session?.user ?? null;
      if (mounted) setUser(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        await fetchProfile(currentUser.id);
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Cek apakah user adalah admin
  const isAdmin = profile?.is_admin === true;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
