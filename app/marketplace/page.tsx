"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// ==============================
// TYPES
// ==============================
type Material = {
  id: string
  title: string
  description: string
  price: number
  image_url: string | null
  latitude: number | null
  longitude: number | null
}

type MaterialWithDistance = Material & {
  distance: number
}

export default function MarketplacePage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [filtered, setFiltered] = useState<MaterialWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // ==============================
  // FETCH DATA (Memoized)
  // ==============================
  const fetchMaterials = useCallback(async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase.from("materials").select("*")
      if (error) throw error
      setMaterials(data || [])
    } catch (err) {
      console.error("Error fetching materials:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==============================
  // INIT + REALTIME (Safe Guarded)
  // ==============================
  useEffect(() => {
    fetchMaterials()

    const client = supabase
    if (!client) return

    const channel = client
      .channel("materials-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "materials" },
        () => fetchMaterials()
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [fetchMaterials])

  // ==============================
  // GEOLOCATION (High Accuracy)
  // ==============================
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        (err) => console.warn("Akses lokasi ditolak:", err.message),
        { enableHighAccuracy: true }
      )
    }
  }, [])

  // ==============================
  // DISTANCE CALCULATION (Haversine)
  // ==============================
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
  }

  // ==============================
  // FILTER RADIUS 15 KM + SORTING
  // ==============================
  useEffect(() => {
    if (!userLocation) {
      // Jika lokasi belum ada, kita tampilkan semua tanpa filter jarak (opsional)
      // Atau tetap kosongkan sesuai logika awal Anda: setFiltered([])
      setFiltered([]) 
      return
    }

    const result = materials
      .filter((item) => item.latitude !== null && item.longitude !== null)
      .map((item) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.latitude!,
          item.longitude!
        )
        return { ...item, distance }
      })
      .filter((item) => item.distance <= 15)
      .sort((a, b) => a.distance - b.distance)

    setFiltered(result)
  }, [materials, userLocation])

  // ==============================
  // UI LOADING STATE
  // ==============================
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Mencari material terdekat...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md p-4 border-b flex justify-between items-center z-50">
        <h1 className="font-black text-2xl text-orange-600 tracking-tighter">REMATRA</h1>
        <Link
          href="/upload"
          className="bg-orange-500 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg shadow-orange-100 active:scale-95 transition-transform"
        >
          + JUAL SISA
        </Link>
      </header>

      {/* LOCATION STATUS INFO */}
      <div className="p-4">
        {!userLocation && (
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-amber-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Aktifkan GPS untuk melihat material di sekitar Anda
          </div>
        )}
      </div>

      {/* CONTENT GRID */}
      <main className="px-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
        {filtered.length === 0 && userLocation && (
          <div className="col-span-2 text-center py-20">
            <p className="text-gray-400 font-medium">Tidak ada material dalam radius 15 KM.</p>
          </div>
        )}

        {filtered.map((item) => (
          <Link key={item.id} href={`/marketplace/${item.id}`} className="active:scale-95 transition-transform">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={item.image_url || "/no-image.png"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  {item.distance.toFixed(1)} KM
                </div>
              </div>

              <div className="p-3">
                <h2 className="text-xs font-bold text-gray-800 line-clamp-2 h-8 mb-1 leading-tight">
                  {item.title}
                </h2>
                <p className="text-orange-600 font-black text-sm">
                  Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </main>

      {/* FOOTER NAV SIMULATION */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 text-center">
         <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">© 2026 REMATRA STARTUP</p>
      </footer>
    </div>
  )
}