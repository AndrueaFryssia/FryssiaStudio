import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase env vars missing. Check your .env file.\n" +
    "REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are required."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Auth helpers
export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });

export const signOut = () => supabase.auth.signOut();

export const getUser = () => supabase.auth.getUser();

// Storage helpers
export const STORAGE_BUCKETS = {
  STICKERS: "stickers",
  GIFT_PHOTOS: "gift-photos",
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
