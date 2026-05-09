// src/utils/cleanupExpiredGifts.js
// ─────────────────────────────────────────────────────────────
// Cleanup utility: hapus gifts expired + file storage-nya.
// Gunakan di AdminPage atau via Supabase Edge Function.
// PATH: src/utils/ → import pakai "../lib/supabase"
// ─────────────────────────────────────────────────────────────
import { supabase } from "../lib/supabase";

/**
 * Hapus semua gifts yang sudah lewat expires_at.
 * Butuh service_role key untuk delete storage.
 * @returns {{ deleted: number, skipped: number, errors: string[] }}
 */
export async function cleanupExpiredGifts() {
  const errors  = [];
  let deleted   = 0;
  let skipped   = 0;

  // 1. Fetch expired gifts
  const { data: expired, error: fetchErr } = await supabase
    .from("gifts")
    .select("id, unique_slug, photo_paths")
    .lt("expires_at", new Date().toISOString());

  if (fetchErr) {
    console.error("[Cleanup] fetch error:", fetchErr.message);
    return { deleted: 0, skipped: 0, errors: [fetchErr.message] };
  }

  if (!expired || expired.length === 0) {
    console.log("[Cleanup] Tidak ada gift yang expired.");
    return { deleted: 0, skipped: 0, errors: [] };
  }

  console.log(`[Cleanup] ${expired.length} gift expired ditemukan.`);

  for (const gift of expired) {
    try {
      // 2. Hapus foto dari storage
      const paths = gift.photo_paths || [];
      if (paths.length > 0) {
        const { error: storErr } = await supabase.storage
          .from("gift-photos")
          .remove(paths);
        if (storErr) {
          console.warn(`[Cleanup] Storage error (${gift.unique_slug}):`, storErr.message);
          errors.push(`storage:${gift.unique_slug} – ${storErr.message}`);
          // Tetap lanjut hapus DB row
        }
      }

      // 3. Hapus row dari DB
      const { error: dbErr } = await supabase
        .from("gifts")
        .delete()
        .eq("id", gift.id);

      if (dbErr) {
        errors.push(`db:${gift.unique_slug} – ${dbErr.message}`);
        skipped++;
      } else {
        deleted++;
        console.log(`[Cleanup] OK: ${gift.unique_slug}`);
      }
    } catch (err) {
      errors.push(`unexpected:${gift.unique_slug} – ${err.message}`);
      skipped++;
    }
  }

  console.log(`[Cleanup] Done. deleted=${deleted} skipped=${skipped} errors=${errors.length}`);
  return { deleted, skipped, errors };
}


// ═══════════════════════════════════════════════════════════════
// SUPABASE EDGE FUNCTION
// File: supabase/functions/cleanup-expired-gifts/index.ts
// Deploy: npx supabase functions deploy cleanup-expired-gifts
// ═══════════════════════════════════════════════════════════════
/*
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Verify secret header
  const secret = req.headers.get("x-cleanup-secret");
  if (secret !== Deno.env.get("CLEANUP_SECRET")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: expired, error: fetchErr } = await supabase
    .from("gifts")
    .select("id, unique_slug, photo_paths")
    .lt("expires_at", new Date().toISOString());

  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), { status: 500 });
  }

  let deleted = 0;
  const errors: string[] = [];

  for (const gift of (expired || [])) {
    const paths: string[] = gift.photo_paths ?? [];
    if (paths.length > 0) {
      const { error: storErr } = await supabase.storage.from("gift-photos").remove(paths);
      if (storErr) errors.push(`storage:${gift.unique_slug}`);
    }
    const { error: dbErr } = await supabase.from("gifts").delete().eq("id", gift.id);
    if (dbErr) errors.push(`db:${gift.unique_slug}`);
    else deleted++;
  }

  return new Response(
    JSON.stringify({ deleted, total: expired?.length ?? 0, errors }),
    { headers: { "Content-Type": "application/json" } }
  );
});
*/

// ═══════════════════════════════════════════════════════════════
// pg_cron SCHEDULER — jadwal tiap jam
// Jalankan di Supabase SQL Editor setelah setup Edge Function
// ═══════════════════════════════════════════════════════════════
/*
-- Enable extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Jadwalkan setiap jam (ganti <ref> dan <secret>)
select cron.schedule(
  'cleanup-expired-gifts',
  '0 * * * *',
  $$
  select net.http_post(
    url    := 'https://<project-ref>.supabase.co/functions/v1/cleanup-expired-gifts',
    headers := jsonb_build_object(
      'x-cleanup-secret', '<CLEANUP_SECRET>',
      'Content-Type',     'application/json'
    ),
    body   := '{}'::jsonb
  );
  $$
);
*/