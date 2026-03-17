import { createClient } from "@supabase/supabase-js"

export const supabase = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("⚠️ Supabase ENV belum tersedia")
    return null
  }

  return createClient(url, key)
})()