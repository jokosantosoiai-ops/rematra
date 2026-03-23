"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase || !id) return

      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error(error)
      }

      setItem(data)
      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading detail...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Data tidak ditemukan</p>
        <button onClick={() => router.push("/marketplace")}>
          Kembali
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32">

      {/* HEADER */}
      <div className="p-4">
        <button onClick={() => router.back()} className="mb-2">
          ← Kembali
        </button>
      </div>

      {/* IMAGE */}
      <img
        src={item.image_url || "/no-image.png"}
        onError={(e) => (e.currentTarget.src = "/no-image.png")}
        className="w-full h-64 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4 space-y-4">

        <h1 className="text-xl font-bold">{item.title}</h1>

        <p className="text-orange-600 text-lg font-bold">
          Rp {item.price?.toLocaleString("id-ID")}
        </p>

        <p className="text-sm text-gray-600">
          {item.description || "Tidak ada deskripsi"}
        </p>

        {/* 🔥 DATA REKENING */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="font-bold text-sm mb-1">Transfer ke:</p>
          <p>{item.bank || "-"} - {item.rekening || "-"}</p>
          <p>a.n {item.atas_nama || "-"}</p>
        </div>

      </div>

      {/* 🔥 CTA WA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a
          href={`https://wa.me/${item.phone}?text=Saya tertarik ${item.title}`}
          target="_blank"
          className="block bg-green-500 text-white text-center py-3 rounded-xl font-bold"
        >
          Hubungi Penjual (WhatsApp)
        </a>
      </div>
    </div>
  )
}