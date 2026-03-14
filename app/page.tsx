"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://qtghfentqazqwtlywjgq.supabase.co"

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2hmZW50cWF6cXd0bHl3amdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTAyMzgsImV4cCI6MjA4ODc2NjIzOH0.YErwfMEGBlVlVoYCC2MA6Kd3GXunCGWLAQBnz6VwqGE"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function Rematra() {

const [mounted,setMounted] = useState(false)

const [role,setRole] =
useState<"home" | "buyer" | "seller">("home")

const [materials,setMaterials] = useState<any[]>([])

const [search,setSearch] = useState("")

const [userLocation,setUserLocation] = useState<any>(null)

const [loadingData,setLoadingData] = useState(true)



useEffect(()=>{

setMounted(true)

fetchMaterials()

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

(p)=>{

setUserLocation({
lat:p.coords.latitude,
lng:p.coords.longitude
})

},

()=>console.log("GPS denied")

)

}

},[])



async function fetchMaterials(){

setLoadingData(true)

const {data} = await supabase
.from("materials")
.select("*")
.order("id",{ascending:false})
.limit(50)

if(data) setMaterials(data)

setLoadingData(false)

}



function getDistance(lat1:number,lon1:number,lat2:number,lon2:number){

const R=6371

const dLat=(lat2-lat1)*Math.PI/180
const dLon=(lon2-lon1)*Math.PI/180

const a=
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*
Math.sin(dLon/2)

return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

}



if(!mounted) return null



return(

<div className="min-h-screen bg-gray-50 text-gray-900 font-sans">



{/* ================= HEADER ================= */}

<header className="bg-[#EE4D2D] text-white pt-10 pb-14 px-6 shadow-xl rounded-b-[40px]">

<div className="max-w-5xl mx-auto text-center">

<img
src="/Logo.jpeg"
className="h-20 mx-auto mb-4 rounded-2xl shadow-lg cursor-pointer"
onClick={()=>setRole("home")}
/>

<h1 className="text-4xl md:text-5xl font-black italic tracking-tight">
REMATRA
</h1>

<p className="mt-3 text-sm font-semibold opacity-90">
Sisa proyek & puing jadi berkah • Harga pas • Langsung angkut
</p>



<div className="flex gap-4 justify-center mt-8 max-w-sm mx-auto">

<button
onClick={()=>setRole("buyer")}
className={`flex-1 py-3 rounded-full font-bold text-sm shadow-md transition
${role==="buyer"
?"bg-white text-[#EE4D2D]"
:"border border-white text-white"}
`}
>
CARI BARANG
</button>

<button
onClick={()=>setRole("seller")}
className={`flex-1 py-3 rounded-full font-bold text-sm shadow-md transition
${role==="seller"
?"bg-white text-[#EE4D2D]"
:"border border-white text-white"}
`}
>
JUAL BARANG
</button>

</div>

</div>

</header>



{/* ================= MAIN ================= */}

<main className="max-w-5xl mx-auto px-6 py-10">



{/* HOME */}

{role==="home" && (

<div className="text-center py-16">

<h2 className="text-3xl md:text-4xl font-black italic mb-2">
CARI CUAN PROYEK?
</h2>

<p className="text-gray-500 text-sm mb-10">
Arsitek.Sign × REMATRA
</p>



<div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">

<div
onClick={()=>setRole("buyer")}
className="bg-white p-8 rounded-3xl shadow-lg cursor-pointer hover:scale-105 transition"
>

<div className="text-4xl mb-3">🛒</div>

<p className="font-bold text-sm uppercase text-gray-500">
Beli
</p>

</div>



<div
onClick={()=>setRole("seller")}
className="bg-white p-8 rounded-3xl shadow-lg cursor-pointer hover:scale-105 transition"
>

<div className="text-4xl mb-3">🏗️</div>

<p className="font-bold text-sm uppercase text-gray-500">
Jual
</p>

</div>

</div>

</div>

)}



{/* ================= BUYER ================= */}

{role==="buyer" && (

<div className="space-y-8">

<div className="bg-white rounded-2xl shadow p-4">

<input
placeholder="Cari material..."
className="w-full p-3 outline-none"
onChange={(e)=>setSearch(e.target.value)}
/>

</div>



{loadingData && (

<p className="text-center text-gray-400">
Memuat material...
</p>

)}



<div className="grid md:grid-cols-2 gap-6">

{materials

.filter(m =>
(m.name||"")
.toLowerCase()
.includes(search.toLowerCase())
)

.filter(m=>{

if(!userLocation) return true

if(!m.lat || !m.lng) return false

const d=getDistance(
userLocation.lat,
userLocation.lng,
m.lat,
m.lng
)

return d<=15

})

.map(item=>{

const dist=userLocation?
getDistance(
userLocation.lat,
userLocation.lng,
item.lat,
item.lng
):null



return(

<div
key={item.id}
className="bg-white rounded-3xl shadow-lg overflow-hidden"
>

<div className="h-52 bg-gray-200">

{item.photo &&

<img
src={item.photo}
className="w-full h-full object-cover"
/>

}

</div>



<div className="p-6">

<h3 className="font-bold text-lg mb-1">
{item.name}
</h3>

<p className="text-[#EE4D2D] text-2xl font-black mb-4">
Rp {item.price?.toLocaleString()}
</p>



{dist &&(

<p className="text-xs text-gray-400 mb-3">
📍 {dist.toFixed(1)} km
</p>

)}



<div className="flex gap-2">

<button
className="flex-1 bg-[#EE4D2D] text-white py-3 rounded-xl font-bold"
>
BELI
</button>

<button
onClick={()=>window.open(`https://wa.me/${item.wa}`)}
className="bg-green-500 text-white px-4 rounded-xl"
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



<footer className="text-center text-xs text-gray-400 py-10">

Arsitek.sign • 2026

</footer>



</div>

)

}