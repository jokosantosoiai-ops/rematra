import { supabase } from "@/lib/supabase"

// ==============================
// FETCH MATERIAL BERDASARKAN RADIUS
// ==============================
export async function fetchNearMaterials(lat: number, lng: number) {
  if (!supabase) {
    throw new Error("Supabase client tidak tersedia")
  }

  const client = supabase

  const { data, error } = await client.rpc("get_nearby_materials", {
    user_lat: lat,
    user_lng: lng,
    radius_meters: 15000, // 15 KM
  })

  if (error) {
    console.error("RPC error:", error)
    throw error
  }

  return data
}