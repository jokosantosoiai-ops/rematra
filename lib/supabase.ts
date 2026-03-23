import { createClient } from "@supabase/supabase-js"

// ==============================
// ENV CONFIG (WAJIB ADA)
// ==============================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ==============================
// VALIDATION (ANTI ERROR DIAM)
// ==============================
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase ENV belum di set!")
}

// ==============================
// CLIENT (SINGLETON)
// ==============================
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // kita tidak pakai login dulu
  },
})