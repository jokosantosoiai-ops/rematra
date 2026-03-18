"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function UploadMaterial() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    phone: "",
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // ==============================
  // GUARD GLOBAL
  // ==============================
  if (!supabase) {
    return <p className="p-4 text-red-500">Supabase belum terkoneksi</p>
  }

  const client = supabase

  // ==============================
  // HANDLE UPLOAD
  // ==============================
  const handleUpload = async () => {
    console.log("UPLOAD CLICKED")

    if (!file || !form.title || !form.price || !form.phone) {
      alert("Lengkapi data + foto + nomor WA")
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        try {
          // ==============================
          // 1. UPLOAD FOTO
          // ==============================
          const fileName = `material-${Date.now()}-${file.name.replace(/\s/g, "_")}`

          const { error: storageError } = await client.storage
            .from("material-photos")
            .upload(fileName, file)

          if (storageError) throw storageError

          const { data } = client.storage
            .from("material-photos")
            .getPublicUrl(fileName)

          const imageUrl = data.publicUrl

          // ==============================
          // 2. INSERT DATABASE
          // ==============================
          const { error: dbError } = await client
            .from("materials")
            .insert([
              {
                title: form.title,
                description: form.description,
                price: parseInt(form.price),
                image_url: imageUrl,
                latitude: lat,
                longitude: lng,
                phone: form.phone,
              },
            ])

          if (dbError) throw dbError

          alert("✅ Material berhasil dipublish!")

          window.location.href = "/marketplace"
        } catch (err: any) {
          console.error(err)
          alert("❌ Gagal upload: " + err.message)
        } finally {
          setLoading(false)
        }
      },
      () => {
        alert("Aktifkan GPS untuk upload lokasi")
        setLoading(false)
      }
    )
  }

  // ==============================
  // UI
  // ==============================
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Upload Material
      </h1>

      <div className="space-y-4">
        <input
          className="w-full border p-3 rounded text-black"
          placeholder="Nama Material"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="w-full border p-3 rounded text-black"
          placeholder="Deskripsi"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border p-3 rounded text-black"
          placeholder="Harga (Rp)"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          className="w-full border p-3 rounded text-black"
          placeholder="Nomor WhatsApp (628xxxx)"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-4 text-white font-bold rounded-lg ${
            loading
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Sekarang"}
        </button>
      </div>
    </div>
  )
}