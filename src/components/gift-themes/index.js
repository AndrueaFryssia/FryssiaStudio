// src/components/gift-themes/index.js

import PixelTheme, { PIXEL_THEME } from "./PixelTheme";
import ValentineTheme, { VALENTINE_THEME } from "./ValentineTheme";
import CyberpunkTheme, { CYBERPUNK_THEME } from "./CyberpunkTheme";
import KraftTheme, { KRAFT_THEME } from "./KraftTheme";
import PastelTheme, { PASTEL_THEME } from "./PastelTheme";

// Konfigurasi Data (Warna, Font, Preview)
export const THEMES = {
  pixel: PIXEL_THEME,
  valentine: VALENTINE_THEME,
  cyberpunk: CYBERPUNK_THEME,
  kraft: KRAFT_THEME,
  pastel: PASTEL_THEME,
};

// Komponen Visual (Landing, Game, Konten)
export const THEME_COMPONENTS = {
  pixel: PixelTheme,
  valentine: ValentineTheme,
  cyberpunk: CyberpunkTheme, // FIX: Sekarang sudah pakai p kecil, cocok dengan import di atas
  kraft: KraftTheme,
  pastel: PastelTheme,
};

// Fungsi pembantu untuk ambil config
export const getThemeConfig = (id) => THEMES[id] || THEMES.pixel;
