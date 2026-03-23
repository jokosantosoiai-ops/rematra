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
    const fetchDetail = async () => {
      if (!supabase || !id) return

      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("id", id)
        .single()

      if (error) console.error(error)

      setItem(data)
      setLoading(false)
    }

    fetchDetail()
  }, [id])

  if (loading) return <div className="p-10 text-center">Loading...</div>

  if (!item) {
    return (
      <div className="p-10 text-center">
        <p>Data tidak ditemukan</p>
        <button onClick={() => router.push("/marketplace")}>
          Kembali
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <img
        src={item.image_url || "/no-image.png"}
        className="w-full h-64 object-cover"
      />

      <div className="p-4">
        <h1 className="text-xl font-bold">{item.title}</h1>
        <p className="text-orange-600 font-bold text-lg">
          Rp {item.price.toLocaleString("id-ID")}
        </p>

        <p className="mt-4 text-sm">
          {item.description || "Tidak ada deskripsi"}
        </p>

        {/* INFO REKENING */}
        <div className="mt-6 p-4 bg-gray-100 rounded">
        <p>{item.bank} - {item.rekening}</p>
        <p>a.n {item.atas_nama}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <a
          href={`https://wa.me/628XXXXXXXXXX?text=Saya mau beli ${item.title}`}
          target="_blank"
          className="block bg-green-500 text-white text-center py-3 rounded font-bold"
        >
          Hubungi Penjual (WA)
        </a>
      </div>
    </div>
  )
}