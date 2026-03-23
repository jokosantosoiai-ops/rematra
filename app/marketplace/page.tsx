"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

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
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // FETCH DATA
  const fetchMaterials = useCallback(async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .limit(50)

      if (error) throw error

      setMaterials(data || [])
    } catch (err) {
      console.error(err)
      setError("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  // GEOLOCATION
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {}
      )
    }
  }, [])

  // HITUNG JARAK
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

  // FILTER + FALLBACK
  useEffect(() => {
    if (!userLocation) {
      const fallback = materials.map((item) => ({
        ...item,
        distance: 999,
      }))
      setFiltered(fallback)
      return
    }

    const result = materials
      .filter((item) => item.latitude && item.longitude)
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="p-4 flex justify-between bg-white border-b">
        <h1 className="font-bold text-orange-600">REMATRA</h1>
        <Link href="/upload" className="bg-orange-500 text-white px-4 py-2 rounded">
          + Jual
        </Link>
      </header>

      {error && (
        <div className="p-4 text-red-500 text-center">{error}</div>
      )}

      <main className="p-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
        {filtered.length === 0 && (
          <div className="col-span-2 text-center">
            <p className="mb-2">Belum ada material</p>
            <Link href="/upload" className="bg-orange-500 text-white px-4 py-2 rounded">
              Jual Sekarang
            </Link>
          </div>
        )}

        {filtered.map((item) => (
          <Link key={item.id} href={`/marketplace/${item.id}`}>
            <div className="bg-white rounded shadow p-2">
              <img
                src={item.image_url || "/no-image.png"}
                onError={(e) => (e.currentTarget.src = "/no-image.png")}
                className="w-full h-32 object-cover rounded"
              />

              <p className="text-sm font-bold mt-2">{item.title}</p>
              <p className="text-orange-600 font-bold text-sm">
                Rp {new Intl.NumberFormat("id-ID").format(item.price)}
              </p>

              <a
                href={`https://wa.me/628XXXXXXXXXX?text=Saya tertarik ${item.title}`}
                target="_blank"
                className="block mt-2 text-center bg-green-500 text-white text-xs py-1 rounded"
              >
                Hubungi
              </a>
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}