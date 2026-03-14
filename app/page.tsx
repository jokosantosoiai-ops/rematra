"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// =============================
// SUPABASE CONNECTION
// =============================

const SUPABASE_URL = "https://qtghfentqazqwtlywjgq.supabase.co"

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2hmZW50cWF6cXd0bHl3amdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTAyMzgsImV4cCI6MjA4ODc2NjIzOH0.YErwfMEGBlVlVoYCC2MA6Kd3GXunCGWLAQBnz6VwqGE"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


// =============================
// COMPONENT
// =============================

export default function Rematra() {

  const [mounted, setMounted] = useState(false)

  const [role, setRole] =
  useState<"home" | "buyer" | "seller" | "dashboard">("home")

  const [materials, setMaterials] = useState<any[]>([])

  const [loading, setLoading] = useState(false)

  const [loadingData, setLoadingData] = useState(true)

  const [search, setSearch] = useState("")

  const [userLocation, setUserLocation] = useState<any>(null)

  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [courierStep, setCourierStep] =
  useState<"selection" | "payment">("selection")

  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    price: "",
    bank: "",
    rekening: "",
    atasNama: "",
    wa: ""
  })

// =============================
// INITIAL LOAD
// =============================

  useEffect(() => {

    setMounted(true)

    fetchMaterials()

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        (p) =>
          setUserLocation({
            lat: p.coords.latitude,
            lng: p.coords.longitude
          }),

        () => console.log("Location permission denied")

      )

    }

  }, [])



// =============================
// FETCH MATERIALS
// =============================

  async function fetchMaterials() {

    setLoadingData(true)

    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("id", { ascending: false })
      .limit(50)

    if (!error && data) setMaterials(data)

    setLoadingData(false)
  }



// =============================
// DISTANCE CALCULATION
// =============================

  function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {

    const R = 6371

    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }



// =============================
// FILE UPLOAD HANDLER
// =============================

  const handleFileChange =
  (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]

    if (!file) return

    setPhotoFile(file)

    setPhotoPreview(URL.createObjectURL(file))
  }



// =============================
// PUBLISH MATERIAL
// =============================

  const handlePublish = async () => {

    if (!form.name || !form.price || !form.rekening || !photoFile) {

      alert("Mohon lengkapi data & foto!")

      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(

      async (p) => {

        try {

          const fileExt = photoFile.name.split(".").pop()

          const fileName =
          `${Date.now()}-${Math.random()}.${fileExt}`

          const filePath = `uploads/${fileName}`

          const { error: uploadError } =
          await supabase.storage
          .from("material-photos")
          .upload(filePath, photoFile)

          if (uploadError) {

            alert("Gagal Upload Foto: " + uploadError.message)

            setLoading(false)

            return
          }

          const {
            data: { publicUrl }
          } = supabase
          .storage
          .from("material-photos")
          .getPublicUrl(filePath)

          const { error: dbError } =
          await supabase.from("materials").insert([{

            ...form,

            price: Number(form.price),

            photo: publicUrl,

            lat: p.coords.latitude,

            lng: p.coords.longitude,

            status: "tersedia"

          }])

          if (dbError) {

            alert("Gagal Simpan Data: " + dbError.message)

          } else {

            fetchMaterials()

            alert("ALHAMDULILLAH TERBIT!")

            setRole("dashboard")

            setPhotoFile(null)

            setPhotoPreview(null)

          }

        } catch (err) {

          console.error(err)

        }

        setLoading(false)

      },

      () => alert("GPS Wajib Aktif!"),

      { timeout: 5000 }

    )
  }



// =============================
// RENDER BLOCK
// =============================

  if (!mounted) return null



  return (

<div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">

{/* ============================= */}
{/* HEADER */}
{/* ============================= */}

<header
style={{ backgroundColor: "#EE4D2D" }}
className="text-white py-12 px-6 text-center shadow-2xl rounded-b-[4rem] border-b-8 border-black/10"
>

<img
src="/Logo.jpeg"
alt="Logo"
className="h-20 mx-auto mb-4 rounded-3xl border-4 border-white/20 shadow-2xl"
onClick={() => setRole("home")}
/>

<h1 className="text-5xl font-black italic tracking-tighter uppercase">
REMATRA
</h1>

<div className="bg-black/20 p-3 rounded-2xl inline-block border border-white/10 mt-3 mx-4">
<p className="text-sm font-bold leading-tight text-white/90 italic">
Sisa proyek & puing jadi berkah, Harga pas, Langsung angkut!
</p>
</div>

<div className="flex gap-4 justify-center mt-12 px-4 max-w-md mx-auto">

<button
onClick={() => setRole("buyer")}
className={`flex-1 py-5 rounded-full font-black text-xs shadow-2xl transition-all
${role === "buyer"
? "bg-white text-[#EE4D2D] scale-110"
: "bg-transparent border-2 border-white text-white opacity-70"}
`}
>
CARI BARANG
</button>

<button
onClick={() => setRole("seller")}
className={`flex-1 py-5 rounded-full font-black text-xs shadow-2xl transition-all
${role === "seller"
? "bg-white text-[#EE4D2D] scale-110"
: "bg-transparent border-2 border-white text-white opacity-70"}
`}
>
JUAL BARANG
</button>

</div>

</header>



{/* ============================= */}
{/* MAIN */}
{/* ============================= */}

<main className="max-w-5xl mx-auto p-6 mt-[-2rem]">

{/* ============================= */}
{/* BUYER VIEW */}
{/* ============================= */}

{role === "buyer" && (

<div className="space-y-8">

<div className="relative shadow-2xl rounded-3xl overflow-hidden bg-white">

<input
placeholder="Cari material sisa..."
className="w-full pl-14 pr-6 py-6 outline-none text-lg font-bold"
onChange={(e)=>setSearch(e.target.value)}
/>

<span className="absolute left-6 top-6 text-xl opacity-40">🔍</span>

</div>


{loadingData && (
<p className="text-center text-gray-400">
Memuat material...
</p>
)}


<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

{materials

.filter(m =>
(m.name || "")
.toLowerCase()
.includes(search.toLowerCase())
)

.filter(m => {

if(!userLocation) return true

if(!m.lat || !m.lng) return false

const d =
getDistance(
userLocation.lat,
userLocation.lng,
m.lat,
m.lng
)

return d <= 15

})

.map(item => {

const dist =
userLocation
? getDistance(
userLocation.lat,
userLocation.lng,
item.lat,
item.lng
)
: null


return (

<div
key={item.id}
className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col"
>

<div className="h-64 bg-gray-200 relative">

{item.photo &&
<img
src={item.photo}
className="w-full h-full object-cover"
/>
}

<div className="absolute top-6 left-6 bg-[#EE4D2D] text-white text-[10px] px-4 py-2 rounded-full font-black uppercase">
{item.status}
</div>

{dist !== null && (

<div className="absolute top-6 right-6 bg-black/50 text-white text-[9px] px-3 py-1.5 rounded-full font-black italic">
📍 {dist.toFixed(1)} KM
</div>

)}

</div>


<div className="p-8">

<h3 className="font-black italic text-2xl uppercase tracking-tighter mb-2">
{item.name}
</h3>

<p className="text-4xl font-black text-[#EE4D2D] mb-8">
Rp {item.price?.toLocaleString()}
</p>


<div className="flex gap-3">

<button
onClick={()=>setSelectedItem(item)}
className="flex-[3] bg-[#EE4D2D] text-white py-5 rounded-[2rem] font-black text-sm"
>
BELI VIA ESCROW
</button>

<button
onClick={() =>
window.open(`https://wa.me/${item.wa}`)
}
className="flex-1 bg-green-500 text-white py-5 rounded-[2rem] font-black text-sm"
>
WA
</button>

</div>

</div>

</div>

)

})}

</div>

</div>

)}

</main>


<footer className="text-center py-12 opacity-30 font-black text-[9px] uppercase italic tracking-[0.5em] text-gray-400">
Arsitek.sign • 2026
</footer>

</div>

)

}