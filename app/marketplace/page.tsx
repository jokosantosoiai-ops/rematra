"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// ==============================
// TYPE DEFINITIONS
// ==============================
type Material = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  latitude: number
  longitude: number
  phone: string
}

type MaterialWithDistance = Material & {
  distance?: number
}

export default function MarketplacePage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [filtered, setFiltered] = useState<MaterialWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchMaterials = async () => {
    try {
      // Guard: Pastikan supabase ada sebelum query
      if (!supabase) return
      
      const { data, error: fetchError } = await supabase
        .from("materials")
        .select("*")

      if (fetchError) throw fetchError
      setMaterials(data || [])
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Gagal memuat data material.")
    } finally {
      setLoading(false)
    }
  }

  // ==============================
  // REALTIME & INIT
  // ==============================
  useEffect(() => {
    fetchMaterials()

    // Solusi Error: Simpan instance ke variable lokal untuk cleanup yang aman
    const supabaseClient = supabase
    if (!supabaseClient) return

    const channel = supabaseClient
      .channel("materials-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "materials" },
        () => fetchMaterials()
      )
      .subscribe()

    return () => {
      // Gunakan variable lokal yang sudah dipastikan tidak null
      supabaseClient.removeChannel(channel)
    }
  }, [])

  // ==============================
  // GEOLOCATION
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
        () => {
          console.warn("User menolak akses lokasi")
        },
        { enableHighAccuracy: true }
      )
    }
  }, [])

  // ==============================
  // DISTANCE LOGIC (15 KM)
  // ==============================
  useEffect(() => {
    if (!userLocation) {
      setFiltered(materials)
      return
    }

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLon = ((lon2 - lon1) * Math.PI) / 180
      const a = 
        Math.sin(dLat / 2) ** 2 + 
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
    }

    const result = materials
      .map((item) => ({
        ...item,
        distance: calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude)
      }))
      .filter((item) => item.distance <= 15) // Batasan 15 KM sesuai objektif
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))

    setFiltered(result)
  }, [materials, userLocation])

  // ==============================
  // RENDER UI
  // ==============================
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-gray-500">Mencari material...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 py-4 border-b">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-2xl font-black text-orange-600 tracking-tighter">REMATRA</h1>
          <Link href="/upload" className="bg-orange-500 text-white px-5 py-2 rounded-full font-bold text-xs shadow-lg shadow-orange-200 active:scale-95 transition-all">
            + JUAL SISA
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {/* STATUS LOKASI */}
        <div className={`mb-6 p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
          userLocation ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-50 border-amber-100 text-amber-700'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${userLocation ? 'bg-green-500' : 'bg-amber-500'}`}></div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {userLocation ? 'Mode: Radius 15 KM Aktif' : 'Mode: Semua Lokasi (GPS Off)'}
          </span>
        </div>

        {/* LIST MATERIAL */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-medium">Tidak ada material ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((item) => (
              <Link key={item.id} href={`/marketplace/${item.id}`} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:bg-gray-50 transition-colors">
                <div className="relative aspect-square">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.distance !== undefined && (
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-black px-2 py-1 rounded-lg shadow-sm border border-gray-100">
                      {item.distance.toFixed(1)} KM
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h2 className="text-[13px] font-bold text-gray-800 line-clamp-2 h-8 leading-tight mb-1">
                    {item.title}
                  </h2>
                  <p className="text-orange-600 font-black text-sm">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                  <div className="mt-3 w-full bg-gray-900 text-white text-[10px] font-black py-2.5 rounded-xl text-center">
                    DETAIL
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-8 mb-4 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2026 REMATRA Startup</p>
      </footer>
    </div>
  )
}