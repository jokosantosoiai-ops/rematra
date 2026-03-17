"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import imageCompression from 'browser-image-compression'

export default function UploadMaterial() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [seller, setSeller] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const uploadMaterial = async () => {
    if (!file) return alert("Pilih foto material terlebih dahulu")
    
    setLoading(true)

    // 1. Ambil GPS dari HP
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      try {
        // 2. Kompresi Gambar (Target max 1MB)
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        }
        const compressedFile = await imageCompression(file, options)

        // 3. Upload Foto ke Supabase Storage
        const fileName = `material-${Date.now()}.jpg`
        const { data: storageData, error: storageError } = await supabase
          .storage
          .from("material-photos")
          .upload(fileName, compressedFile)

        if (storageError) throw storageError

        // 4. Ambil Public URL
        const photoUrl = supabase
          .storage
          .from("material-photos")
          .getPublicUrl(fileName)
          .data.publicUrl

        // 5. Simpan ke Database (Termasuk kolom location untuk PostGIS)
        const { error: dbError } = await supabase
          .from("materials")
          .insert({
            title: title,
            price: parseInt(price), // Pastikan angka
            seller_name: seller,
            seller_whatsapp: whatsapp,
            photo_url: photoUrl,
            // Format POINT untuk PostGIS (Longitude dulu baru Latitude)
            location: `POINT(${lng} ${lat})`,
            lat: lat, // Tetap simpan angka biasa untuk backup jika perlu
            lng: lng
          })

        if (dbError) throw dbError

        alert("Material berhasil diposting!")
        // Reset Form
        window.location.reload()

      } catch (err: any) {
        alert("Terjadi kesalahan: " + err.message)
      } finally {
        setLoading(false)
      }
    }, (geoError) => {
      alert("Gagal mengambil lokasi. Pastikan GPS aktif.")
      setLoading(false)
    })
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Upload Material Sisa</h1>
      <p className="text-sm text-gray-500 italic">
        *Aplikasi akan otomatis mengambil lokasi Anda saat ini untuk memudahkan pembeli terdekat.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Nama Material</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="Contoh: Bata Merah Sisa 500 Biji"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Harga (Rp)</label>
        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Contoh: 50000"
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Nama Penjual</label>
          <input
            className="border p-2 w-full rounded"
            placeholder="Nama Anda"
            onChange={(e) => setSeller(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">WhatsApp</label>
          <input
            className="border p-2 w-full rounded"
            placeholder="0812xxxx"
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Foto Material</label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        onClick={uploadMaterial}
        disabled={loading}
        className={`w-full py-3 rounded font-bold text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {loading ? "Sedang Memproses..." : "Posting Material Sekarang"}
      </button>
    </div>
  )
}