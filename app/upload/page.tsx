"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function UploadMaterial() {

  const [title,setTitle] = useState("")
  const [price,setPrice] = useState("")
  const [seller,setSeller] = useState("")
  const [whatsapp,setWhatsapp] = useState("")
  const [file,setFile] = useState<File | null>(null)

  const uploadMaterial = async () => {

    if(!file) return alert("Upload foto dulu")

    // ambil GPS dari HP
    navigator.geolocation.getCurrentPosition(async(position)=>{

      const lat = position.coords.latitude
      const lng = position.coords.longitude

      // upload foto
      const fileName = `material-${Date.now()}.jpg`

      const { data,error } = await supabase
        .storage
        .from("material-photos")
        .upload(fileName,file)

      if(error){
        alert("Upload foto gagal")
        return
      }

      const photoUrl =
        supabase
        .storage
        .from("material-photos")
        .getPublicUrl(fileName)
        .data.publicUrl

      // simpan ke database
      const { error:dbError } = await supabase
        .from("materials")
        .insert({
          title:title,
          price:price,
          seller_name:seller,
          seller_whatsapp:whatsapp,
          photo_url:photoUrl,
          lat:lat,
          lng:lng
        })

      if(dbError){
        alert("Simpan database gagal")
      }else{
        alert("Material berhasil diupload")
      }

    })

  }

  return (

    <div className="p-6 max-w-xl mx-auto space-y-4">

      <h1 className="text-2xl font-bold">
        Upload Material
      </h1>

      <input
        className="border p-2 w-full"
        placeholder="Judul Material"
        onChange={(e)=>setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Harga"
        onChange={(e)=>setPrice(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Nama Penjual"
        onChange={(e)=>setSeller(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Nomor WhatsApp"
        onChange={(e)=>setWhatsapp(e.target.value)}
      />

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadMaterial}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload Material
      </button>

    </div>
  )
}