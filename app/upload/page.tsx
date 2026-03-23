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

  // ✅ NEW (REKENING)
  const [bank, setBank] = useState("")
  const [rekening, setRekening] = useState("")
  const [atasNama, setAtasNama] = useState("")

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {
          alert("GPS wajib aktif untuk jual material")
        },
        { enableHighAccuracy: true }
      )
    }
  }, [])

  // IMAGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // VALIDASI
  const validate = () => {
    if (!image) return "Foto wajib"
    if (!location) return "GPS wajib aktif"
    if (!title) return "Nama barang wajib"
    if (!price) return "Harga wajib"
    if (!phone) return "Nomor WA wajib"
    if (!bank) return "Bank wajib"
    if (!rekening) return "Nomor rekening wajib"
    if (!atasNama) return "Atas nama wajib"
    return null
  }

  // NORMALISASI NOMOR WA
  const normalizePhone = (num: string) => {
    let p = num.replace(/\D/g, "")
    if (p.startsWith("0")) p = "62" + p.slice(1)
    if (!p.startsWith("62")) p = "62" + p
    return p
  }

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errorMsg = validate()
    if (errorMsg) {
      alert(errorMsg)
      return
    }

    if (!supabase) {
      alert("Server error")
      return
    }

    setLoading(true)

    try {
      // 1. UPLOAD IMAGE
      const fileName = `${Date.now()}-${image!.name}`

      const { error: uploadError } = await supabase.storage
        .from("material-images")
        .upload(fileName, image!)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from("material-images")
        .getPublicUrl(fileName)

      // 2. INSERT DATABASE
      const { data, error } = await supabase
        .from("materials")
        .insert([
          {
            title,
            description: desc,
            price: parseInt(price),
            phone: normalizePhone(phone),
            bank,
            rekening,
            atas_nama: atasNama,
            latitude: location!.lat,
            longitude: location!.lng,
            image_url: urlData.publicUrl,
          },
        ])
        .select()

      if (error) throw error

      alert("Berhasil dipublish!")

      // redirect ke detail
      const newId = data[0].id
      router.push(`/marketplace/${newId}`)
    } catch (err: any) {
      alert("Gagal: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="p-4 border-b flex items-center gap-4">
        <button onClick={() => router.back()}>←</button>
        <h1 className="font-bold">JUAL MATERIAL</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-5 max-w-md mx-auto">
        
        {/* IMAGE */}
        <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />

        {preview && (
          <img src={preview} className="w-full h-40 object-cover rounded" />
        )}

        {/* DATA */}
        <input placeholder="Nama Barang" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3" />
        <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3" />
        <input placeholder="Nomor WA (628...)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-3" />

        <textarea placeholder="Deskripsi" value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border p-3" />

        {/* ✅ REKENING */}
        <div className="bg-gray-50 p-4 rounded space-y-3">
          <p className="text-sm font-bold">Data Rekening</p>

          <input placeholder="Nama Bank (BCA, BRI, dll)" value={bank} onChange={(e) => setBank(e.target.value)} className="w-full border p-2" />
          <input placeholder="Nomor Rekening" value={rekening} onChange={(e) => setRekening(e.target.value)} className="w-full border p-2" />
          <input placeholder="Atas Nama" value={atasNama} onChange={(e) => setAtasNama(e.target.value)} className="w-full border p-2" />
        </div>

        {/* GPS */}
        <p className="text-xs">
          {location ? "Lokasi terkunci" : "Mengaktifkan GPS..."}
        </p>

        <button disabled={loading} className="w-full bg-orange-600 text-white p-4 rounded">
          {loading ? "Proses..." : "JUAL SEKARANG"}
        </button>
      </form>
    </div>
  )
}