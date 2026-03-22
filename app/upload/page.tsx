"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [desc, setDesc] = useState("")
  const [phone, setPhone] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    // Lock GPS langsung saat buka halaman
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        null,
        { enableHighAccuracy: true }
      )
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image || !location || !supabase) {
      alert("Pastikan foto sudah diambil dan GPS aktif!")
      return
    }

    setLoading(true)
    try {
      // 1. Upload ke Storage
      const fileName = `${Date.now()}-${image.name}`
      const { data: storageData, error: storageError } = await supabase.storage
        .from("material-images")
        .upload(fileName, image)

      if (storageError) throw storageError

      const { data: urlData } = supabase.storage
        .from("material-images")
        .getPublicUrl(fileName)

      // 2. Insert ke Database
      const { error: dbError } = await supabase.from("materials").insert({
        title,
        description: desc,
        price: parseInt(price),
        phone,
        latitude: location.lat,
        longitude: location.lng,
        image_url: urlData.publicUrl,
      })

      if (dbError) throw dbError

      alert("Material Berhasil Tayang!")
      router.push("/Marketplace")
    } catch (err: any) {
      alert("Gagal: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-10 font-sans">
      <header className="p-4 border-b flex items-center gap-4 sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
        </button>
        <h1 className="text-lg font-black">JUAL MATERIAL</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-5 space-y-6 max-w-md mx-auto">
        {/* KAMERA PREVIEW */}
        <div className="relative border-2 border-dashed border-gray-200 rounded-3xl aspect-video flex flex-col items-center justify-center overflow-hidden bg-gray-50 active:scale-95 transition-transform">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <div className="bg-orange-500 text-white p-4 rounded-full inline-block mb-3 shadow-lg shadow-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
              </div>
              <p className="text-xs font-black text-gray-400">AMBIL FOTO MATERIAL</p>
            </div>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          <input type="text" placeholder="Nama Barang (Contoh: Semen Sisa)" className="w-full border-b-2 border-gray-100 py-3 text-lg font-bold outline-none focus:border-orange-500" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="number" placeholder="Harga Jual (Rp)" className="w-full border-b-2 border-gray-100 py-3 text-lg font-bold text-orange-600 outline-none focus:border-orange-500" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="tel" placeholder="Nomor WA (628...)" className="w-full border-b-2 border-gray-100 py-3 text-lg font-bold outline-none focus:border-orange-500" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <textarea placeholder="Kondisi barang & lokasi tepatnya..." className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-medium outline-none border border-gray-100 focus:border-orange-500" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} required />
        </div>

        {/* GPS STATUS */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
          <div className={`w-2 h-2 rounded-full ${location ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {location ? 'Lokasi Proyek Terkunci' : 'Mengaktifkan GPS...'}
          </span>
        </div>

        <button disabled={loading} className="w-full bg-orange-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-orange-100 active:scale-95 disabled:bg-gray-200 transition-all uppercase tracking-tighter">
          {loading ? "PROSES..." : "JUAL SEKARANG"}
        </button>
      </form>
    </div>
  )
}