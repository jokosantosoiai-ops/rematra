"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Material = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  latitude: number
  longitude: number
}

export default function MarketplacePage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [filtered, setFiltered] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // 🔥 Ambil data dari Supabase
  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from("materials")
      .select("*")

    if (error) {
      console.error(error)
    } else {
      setMaterials(data || [])
    }

    setLoading(false)
  }

  // 🔥 Ambil lokasi user
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      (err) => {
        console.error("Location error:", err)
      }
    )
  }

  // 🔥 Hitung jarak (KM)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // 🔥 Filter radius 15 KM
  useEffect(() => {
    if (!userLocation) return

    const result = materials.filter((item) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        item.latitude,
        item.longitude
      )

      return distance <= 15
    })

    setFiltered(result)
  }, [userLocation, materials])

  useEffect(() => {
    fetchMaterials()
    getLocation()
  }, [])

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Marketplace REMATRA (Radius 15 KM)
      </h1>

      {filtered.length === 0 && (
        <p>Tidak ada material di sekitar Anda</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-2 shadow"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-32 object-cover rounded"
            />

            <h2 className="font-semibold mt-2">
              {item.title}
            </h2>

            <p className="text-sm text-gray-500">
              {item.description}
            </p>

            <p className="font-bold mt-1">
              Rp {item.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}