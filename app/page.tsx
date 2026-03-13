"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// --- KONEKSI CLOUD (DIKUNCI) ---
const SUPABASE_URL = "https://qtghfentqazqwtlywjgq.supabase.co" 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2hmZW50cWF6cXd0bHl3amdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTAyMzgsImV4cCI6MjA4ODc2NjIzOH0.YErwfMEGBlVlVoYCC2MA6Kd3GXunCGWLAQBnz6VwqGE"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function Rematra() {
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<"home" | "buyer" | "seller" | "dashboard">("home")
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [userLocation, setUserLocation] = useState<any>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", price: "", bank: "", rekening: "", atasNama: "", wa: "" })

  useEffect(() => {
    setMounted(true)
    fetchMaterials()

    // --- OPTIMASI GEOLOCATION ---
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setUserLocation({
            lat: p.coords.latitude,
            lng: p.coords.longitude
          })
        },
        (error) => {
          console.log("Akses lokasi ditolak/error:", error.message)
        },
        { timeout: 10000 }
      )
    }
  }, [])

  // --- OPTIMASI PERFORMA (LIMIT 50) ---
  async function fetchMaterials() {
    const { data } = await supabase
      .from('materials')
      .select('*')
      .order('id', { ascending: false })
      .limit(50)
    
    if (data) setMaterials(data)
  }

  if (!mounted) return null

  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handlePublish = async () => {
    if (!form.name || !form.price || !form.rekening || !photoFile) return alert("Mohon lengkapi data & foto!")
    setLoading(true)

    navigator.geolocation.getCurrentPosition(async (p) => {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('material-photos')
        .upload(filePath, photoFile)

      if (uploadError) {
        alert("Gagal Upload Foto: " + uploadError.message)
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage.from('material-photos').getPublicUrl(filePath)

      const { error: dbError } = await supabase.from('materials').insert([{ 
        ...form, price: Number(form.price), photo: publicUrl, 
        lat: p.coords.latitude, lng: p.coords.longitude, status: 'tersedia' 
      }])

      if (dbError) alert("Gagal Simpan Data: " + dbError.message)
      else { 
        fetchMaterials(); 
        alert("ALHAMDULILLAH TERBIT!"); 
        setRole("dashboard"); 
        setPhotoFile(null); 
        setPhotoPreview(null); 
      }
      setLoading(false)
    }, () => {
      alert("GPS Wajib Aktif untuk menentukan lokasi barang!");
      setLoading(false);
    }, { timeout: 5000 })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      
      {/* HEADER MEWAH - VISUAL TETAP PROPORSIONAL */}
      <header style={{ backgroundColor: '#EE4D2D' }} className="text-white py-12 px-6 text-center shadow-2xl rounded-b-[4rem] border-b-8 border-black/10">
        <img src="/Logo.jpeg" alt="Logo" className="h-20 mx-auto mb-4 rounded-3xl border-4 border-white/20 shadow-2xl cursor-pointer" onClick={() => setRole("home")} />
        <h1 className="text-5xl font-black italic tracking-tighter uppercase">REMATRA</h1>
        <div className="bg-black/20 p-3 rounded-2xl inline-block border border-white/10 mt-3 mx-4">
          <p className="text-sm font-bold leading-tight text-white/90 italic">Sisa proyek & puing jadi berkah, Harga pas, Langsung angkut!</p>
        </div>
        
        <div className="flex gap-4 justify-center mt-12 px-4 max-w-md mx-auto">
          <button onClick={() => setRole("buyer")} className={`flex-1 py-5 rounded-full font-black text-xs shadow-2xl transition-all ${role === 'buyer' ? 'bg-white text-[#EE4D2D] scale-110' : 'bg-transparent border-2 border-white text-white opacity-70'}`}>CARI BARANG</button>
          <button onClick={() => setRole("seller")} className={`flex-1 py-5 rounded-full font-black text-xs shadow-2xl transition-all ${role === 'seller' ? 'bg-white text-[#EE4D2D] scale-110' : 'bg-transparent border-2 border-white text-white opacity-70'}`}>JUAL BARANG</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-[-2rem]">
        
        {/* KATALOG PEMBELI */}
        {role === "buyer" && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="relative shadow-2xl rounded-3xl overflow-hidden bg-white">
              <input placeholder="Cari material sisa..." className="w-full pl-14 pr-6 py-6 outline-none text-lg font-bold border-none" onChange={e => setSearch(e.target.value)} />
              <span className="absolute left-6 top-6 text-xl opacity-40">🔍</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {materials
                .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
                .filter(m => {
                    if(!userLocation) return true
                    const d = getDistance(userLocation.lat, userLocation.lng, m.lat, m.lng)
                    return d <= 15
                })
                .map(item => {
                  const dist = userLocation ? getDistance(userLocation.lat, userLocation.lng, item.lat, item.lng) : null;
                  return (
                    <div key={item.id} className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col transition-transform hover:scale-[1.02]">
                      <div className="h-64 bg-gray-200 relative">
                        {item.photo && <img src={item.photo} className="w-full h-full object-cover" alt={item.name} />}
                        <div className="absolute top-6 left-6 bg-[#EE4D2D] text-white text-[10px] px-4 py-2 rounded-full font-black shadow-lg uppercase">{item.status}</div>
                        {dist !== null && (
                          <div className="absolute top-6 right-6 bg-black/50 text-white text-[9px] px-3 py-1.5 rounded-full font-black italic shadow-lg">📍 {dist.toFixed(1)} KM</div>
                        )}
                      </div>
                      <div className="p-8">
                        <h3 className="font-black italic text-2xl uppercase tracking-tighter mb-2 text-gray-800 leading-tight">{item.name}</h3>
                        <p className="text-4xl font-black text-[#EE4D2D] mb-8 tracking-tighter">Rp {item.price?.toLocaleString()}</p>
                        <div className="flex gap-3">
                          <button className="flex-[3] bg-[#EE4D2D] text-white py-5 rounded-[2rem] font-black text-sm shadow-xl active:scale-95">BELI VIA ESCROW</button>
                          <button onClick={() => window.open(`https://wa.me/${item.wa}`)} className="flex-1 bg-green-500 text-white py-5 rounded-[2rem] font-black text-sm shadow-xl flex items-center justify-center">WA</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* VIEW SELLER */}
        {role === "seller" && (
          <div className="max-w-md mx-auto bg-white p-10 rounded-[4rem] shadow-2xl border-t-[12px] border-[#EE4D2D] space-y-5">
            <h2 className="text-3xl font-black italic text-center text-[#EE4D2D] uppercase tracking-tighter">Posting Material</h2>
            <div className="border-4 border-dashed border-gray-100 p-2 rounded-[2.5rem] h-48 flex items-center justify-center overflow-hidden bg-gray-50 relative">
              {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" /> : <p className="text-gray-300 font-black italic text-xs">FOTO BARANG</p>}
            </div>
            <input type="file" id="up" className="hidden" onChange={handleFileChange} capture="environment" />
            <label htmlFor="up" className="block w-full text-center bg-gray-800 text-white py-4 rounded-2xl font-black text-[10px] cursor-pointer">AMBIL FOTO</label>
            <div className="space-y-4 pt-2">
              <input placeholder="Nama Barang" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-sm" onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="Harga Jual" type="number" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-sm text-[#EE4D2D]" onChange={e => setForm({...form, price: e.target.value})} />
              <input placeholder="Nomor WA (62...)" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-sm" onChange={e => setForm({...form, wa: e.target.value})} />
              <div className="bg-orange-50/50 p-6 rounded-[2.5rem] space-y-3 border border-orange-100">
                <input placeholder="Nama Bank" className="w-full p-3 bg-white rounded-lg outline-none font-bold text-xs" onChange={e => setForm({...form, bank: e.target.value})} />
                <input placeholder="No. Rekening" className="w-full p-3 bg-white rounded-lg outline-none font-bold text-xs" onChange={e => setForm({...form, rekening: e.target.value})} />
                <input placeholder="Atas Nama" className="w-full p-3 bg-white rounded-lg outline-none font-bold text-xs border border-orange-200" onChange={e => setForm({...form, atasNama: e.target.value})} />
              </div>
              <button disabled={loading} onClick={handlePublish} className={`w-full py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl mt-4 transition-all ${loading ? 'bg-gray-400' : 'bg-[#EE4D2D] text-white active:scale-95'}`}>{loading ? "MENGIRIM FOTO..." : "PUBLIKASIKAN"}</button>
            </div>
          </div>
        )}

        {/* HOME VIEW */}
        {role === "home" && (
           <div className="text-center py-24 space-y-12 animate-in zoom-in duration-1000">
             <div className="space-y-3 px-6">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter text-gray-800 leading-none">CARI CUAN PROYEK?</h2>
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Arsitek.Sign x REMATRA</p>
             </div>
             <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col items-center cursor-pointer hover:scale-110 transition-all" onClick={() => setRole("buyer")}>
                   <span className="text-5xl mb-4">🛒</span>
                   <p className="font-black text-[11px] uppercase tracking-widest text-gray-500 italic">Beli</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col items-center cursor-pointer hover:scale-110 transition-all" onClick={() => setRole("seller")}>
                   <span className="text-5xl mb-4">🏗️</span>
                   <p className="font-black text-[11px] uppercase tracking-widest text-gray-500 italic">Jual</p>
                </div>
             </div>
           </div>
        )}
      </main>

      <footer className="text-center py-12 opacity-30 font-black text-[9px] uppercase italic tracking-[0.5em] text-gray-400">Arsitek.sign • 2026</footer>
    </div>
  )
}