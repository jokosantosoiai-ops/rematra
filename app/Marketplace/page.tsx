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
  phone: string
}

export default function MarketplacePage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [filtered, setFiltered] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // ==============================
  // HITUNG JARAK (KM)
  // ==============================
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
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchMaterials = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

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

  // ==============================
  // REALTIME UPDATE 🔥
  // ==============================
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel("materials-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "materials",
        },
        () => {
          fetchMaterials()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // ==============================
  // GET USER LOCATION
  // ==============================
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      () => {
        setFiltered(materials)
      }
    )
  }, [])

  // ==============================
  // FILTER + SORT 🔥
  // ==============================
  useEffect(() => {
    if (!userLocation) {
      setFiltered(materials)
      return
    }

    const result = materials
      .map((item) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.latitude,
          item.longitude
        )

        return { ...item, distance }
      })
      .filter((item) => item.distance <= 15)
      .sort((a, b) => a.distance - b.distance)

    setFiltered(result)
  }, [materials, userLocation])

  useEffect(() => {
    fetchMaterials()
  }, [])

  // ==============================
  // LOADING
  // ==============================
  if (loading) return <p className="p-4">Loading...</p>

  if (!supabase) {
    return <p className="p-4">Supabase belum terkoneksi</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Marketplace REMATRA (Terdekat 15 KM)
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((item: any) => (
          <div
            key={item.id}
            className="border rounded-xl p-2 shadow"
          >
            <img
              src={item.image_url}
              className="w-full h-32 object-cover rounded"
            />

            <h2 className="font-semibold mt-2">
              {item.title}
            </h2>

            <p className="text-sm text-gray-500">
              {item.description}
            </p>

            <p className="font-bold">
              Rp {item.price.toLocaleString()}
            </p>

            {item.distance && (
              <p className="text-xs text-green-600">
                {item.distance.toFixed(2)} KM
              </p>
            )}

            {/* 🔥 WHATSAPP BUTTON */}
            <a
              href={`https://wa.me/${item.phone}`}
              target="_blank"
              className="block mt-2 bg-green-500 text-white text-center py-1 rounded"
            >
              Hubungi Seller
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}