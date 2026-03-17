"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function UploadMaterial() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [seller, setSeller] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadMaterial = async () => {
    if (!file || !title || !price) return alert("Mohon lengkapi data dan foto")
    
    setIsUploading(true)

    // Ambil GPS
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude: lat, longitude: lng } = position.coords

      try {
        const fileName = `${Date.now()}-${file.name}`
        
        // 1. Upload ke Storage
        const { data: uploadData, error: storageError } = await supabase.storage
          .from("material-photos")
          .upload(fileName, file)

        if (storageError) throw storageError

        const { data: { publicUrl } } = supabase.storage
          .from("material-photos")
          .getPublicUrl(fileName)

        // 2. Simpan ke Database
        const { error: dbError } = await supabase
          .from("materials")
          .insert([{
            title,
            price: parseInt(price),
            seller_name: seller,
            seller_whatsapp: whatsapp,
            photo_url: publicUrl,
            lat,
            lng,
            location: `POINT(${lng} ${lat})` // Untuk PostGIS
          }])

        if (dbError) throw dbError

        alert("Berhasil upload!")
        window.location.href = "/marketplace"

      } catch (err: any) {
        alert("Error: " + err.message)
      } finally {
        setIsUploading(false)
      }
    }, (error) => {
      alert("Gagal mengambil lokasi. Pastikan izin lokasi aktif.")
      setIsUploading(false)
    })
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Upload Material</h1>
      <input className="text-black border p-2 w-full" placeholder="Judul" onChange={e => setTitle(e.target.value)} />
      <input className="text-black border p-2 w-full" type="number" placeholder="Harga" onChange={e => setPrice(e.target.value)} />
      <input className="text-black border p-2 w-full" placeholder="Nama Penjual" onChange={e => setSeller(e.target.value)} />
      <input className="text-black border p-2 w-full" placeholder="WA" onChange={e => setWhatsapp(e.target.value)} />
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      
      <button 
        onClick={uploadMaterial}
        disabled={isUploading}
        className={`w-full py-3 text-white rounded font-bold ${isUploading ? 'bg-gray-400' : 'bg-green-600'}`}
      >
        {isUploading ? "Proses..." : "Upload Material"}
      </button>
    </div>
  )
}