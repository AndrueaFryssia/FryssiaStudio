import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fungsi tunggal buat sinkronisasi User & Profile biar ga balapan
    const syncAuth = async () => {
      if (!mounted) return;
      setLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const currentUser = session?.user ?? null;
        if (mounted) setUser(currentUser);

        if (currentUser) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();
          if (mounted) setProfile(data);
        } else {
          if (mounted) setProfile(null);
        }
      } catch (err) {
        console.error("Auth sync error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    syncAuth(); // Panggil pas awal web dibuka

    // Pantau kalau tiba-tiba login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'INITIAL_SESSION') return;
      syncAuth(); // Panggil ulang sinkronisasi
    });

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
