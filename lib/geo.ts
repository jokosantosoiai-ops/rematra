import { supabase } from '@/lib/supabase'

async function fetchNearMaterials(lat: number, lng: number) {
  const { data, error } = await supabase.rpc('get_nearby_materials', {
    user_lat: lat,
    user_lng: lng,
    radius_meters: 15000 // 15 KM
  });

  if (error) console.error(error);
  return data;
}