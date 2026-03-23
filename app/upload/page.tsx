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
        () => alert("GPS wajib aktif"),
        { enableHighAccuracy: true }
      )
    }
  }, [])

  // IMAGE
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // VALIDASI
  const validate = () => {
    if (!image) return "Foto wajib"
    if (!location) return "GPS wajib"
    if (!title) return "Nama wajib"
    if (!price) return "Harga wajib"
    if (!phone) return "WA wajib"
    if (!bank) return "Bank wajib"
    if (!rekening) return "Rekening wajib"
    if (!atasNama) return "Atas nama wajib"
    return null
  }

  const normalizePhone = (num: string) => {
    let p = num.replace(/\D/g, "")
    if (p.startsWith("0")) p = "62" + p.slice(1)
    if (!p.startsWith("62")) p = "62" + p
    return p
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const errorMsg = validate()
    if (errorMsg) return alert(errorMsg)

    if (!supabase) return alert("Server error")

    setLoading(true)

    try {
      const fileName = `${Date.now()}-${image!.name}`

      await supabase.storage
        .from("material-images")
        .upload(fileName, image!)

      const { data: urlData } = supabase.storage
        .from("material-images")
        .getPublicUrl(fileName)

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

      const newId = data[0].id

      alert("Berhasil upload!")
      router.push(`/marketplace/${newId}`)

    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">

      <h1 className="font-bold mb-4">JUAL MATERIAL</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* CAMERA */}
        <div className="relative border h-40 flex items-center justify-center">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <p>📷 Klik untuk ambil foto</p>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0"
          />
        </div>

        <input placeholder="Nama Barang" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2" />
        <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2" />
        <input placeholder="Nomor WA" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2" />
        <textarea placeholder="Deskripsi" value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border p-2" />

        {/* REKENING */}
        <div className="bg-gray-100 p-3 rounded">
          <p className="font-bold text-sm">Data Rekening</p>
          <input placeholder="Bank" value={bank} onChange={(e) => setBank(e.target.value)} className="w-full border p-2 mt-2" />
          <input placeholder="No Rekening" value={rekening} onChange={(e) => setRekening(e.target.value)} className="w-full border p-2 mt-2" />
          <input placeholder="Atas Nama" value={atasNama} onChange={(e) => setAtasNama(e.target.value)} className="w-full border p-2 mt-2" />
        </div>

        <button className="w-full bg-orange-600 text-white p-3 rounded">
          {loading ? "Proses..." : "JUAL SEKARANG"}
        </button>

      </form>
    </div>
  )
}