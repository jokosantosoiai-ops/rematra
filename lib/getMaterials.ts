import { supabase } from "@/lib/supabase"

export async function getMaterials() {
  if (!supabase) {
    throw new Error("Supabase client tidak tersedia")
  }

  const client = supabase

  const { data, error } = await client
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Fetch materials error:", error)
    throw error
  }

  return data || []
}