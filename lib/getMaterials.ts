import { supabase } from "./supabase"

export async function getMaterials() {

  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
}