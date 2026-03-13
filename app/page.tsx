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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (e) => console.log("GPS Off"),
        { timeout: 10000 }
      )
    }
  }, [])

  async function fetchMaterials() {
    const { data } = await supabase.from('materials').select('*').order('id', { ascending: false }).limit(50)
    if (data) setMaterials(data)
  }

  if (!mounted) return null

  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file))
  }

  const handlePublish = async () => {
    if (!form.name || !form.price || !form.rekening || !photoFile) return alert("Mohon lengkapi data & foto!")
    setLoading(true)
    navigator.geolocation.getCurrentPosition(async (p) => {
      const fileName = `${Math.random()}.${photoFile.name.split('.').pop()}`
      const filePath = `uploads/${fileName}`
      const { error: upErr } = await supabase.storage.from('material-photos').upload(filePath, photoFile)
      if (upErr) { alert("Upload Gagal"); setLoading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('material-photos').getPublicUrl(filePath)
      const { error: dbErr } = await supabase.from('materials').insert([{ ...form, price: Number(form.price), photo: publicUrl, lat: p.coords.latitude, lng: p.coords.longitude, status: 'tersedia' }])
      if (dbErr) alert("Gagal Simpan"); else { fetchMaterials(); alert("BERHASIL TERBIT!"); setRole("buyer"); }
      setLoading(false)
    }, () => { alert("GPS Wajib Aktif"); setLoading(false); })
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D3436] pb-20 font-sans selection:bg-[#EE4D2D] selection:text-white">
      
      {/* HEADER: Proporsional & Elegan */}
      <header style={{ backgroundColor: '#EE4D2D' }} className="text-white pt-10 pb-14 px-6 text-center shadow-xl rounded-b-[3rem] md:rounded-b-[5rem] border-b-4 border-black/5">
        <img src="/Logo.jpeg" alt="Logo" className="h-16 md:h-20 mx-auto mb-4 rounded-2xl border-2 border-white/30 shadow-lg cursor-pointer active:scale-95 transition-transform" onClick={() => setRole("home")} />
        <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase leading-none">REMATRA</h1>
        <p className="text-[10px] md:text-sm font-medium mt-3 opacity-90 tracking-wide max-w-xs mx-auto italic uppercase">Sisa Proyek Jadi Berkah • Langsung Angkut</p>
        
        <div className="flex gap-3 justify-center mt-10 px-2 max-w-sm mx-auto">
          <button onClick={() => setRole("buyer")} className={`flex-1 py-4 rounded-2xl font-bold text-[11px] md:text-xs shadow-lg transition-all ${role === 'buyer' ? 'bg-white text-[#EE4D2D] scale-105' : 'bg-black/10 border border-white/20 text-white'}`}>CARI BARANG</button>
          <button onClick={() => setRole("seller")} className={`flex-1 py-4 rounded-2xl font-bold text-[11px] md:text-xs shadow-lg transition-all ${role === 'seller' ? 'bg-white text-[#EE4D2D] scale-105' : 'bg-black/10 border border-white/20 text-white'}`}>JUAL BARANG</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 -mt-8">
        {/* VIEW: HOME */}
        {role === "home" && (
          <div className="text-center py-16 md:py-24 space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter text-[#2D3436]">CARI CUAN PROYEK?</h2>
              <p className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.4em]">Arsitek.Sign x REMATRA</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-sm mx-auto px-4">
              <div onClick={() => setRole("buyer")} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-all active:scale-95">
                <span className="text-4xl md:text-5xl mb-3">🛒</span>
                <p className="font-bold text-[10px] uppercase tracking-widest text-gray-500 italic">Beli</p>
              </div>
              <div onClick={() => setRole("seller")} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-all active:scale-95">
                <span className="text-4xl md:text-5xl mb-3">🏗️</span>
                <p className="font-bold text-[10px] uppercase tracking-widest text-gray-500 italic">Jual</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: BUYER (KATALOG) */}
        {role === "buyer" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative shadow-lg rounded-2xl overflow-hidden bg-white border border-gray-100">
              <input placeholder="Cari material sisa..." className="w-full pl-12 pr-4 py-5 outline-none text-sm md:text-base font-semibold" onChange={e => setSearch(e.target.value)} />
              <span className="absolute left-4 top-5 opacity-30 text-lg">🔍</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materials
                .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
                .filter(m => !userLocation || getDistance(userLocation.lat, userLocation.lng, m.lat, m.lng) <= 15)
                .map(item => {
                  const dist = userLocation ? getDistance(userLocation.lat, userLocation.lng, item.lat, item.lng) : null;
                  return (
                    <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                      <div className="h-56 md:h-64 bg-gray-100 relative">
                        {item.photo && <img src={item.photo} className="w-full h-full object-cover" alt={item.name} />}
                        <div className="absolute top-4 left-4 bg-[#EE4D2D] text-white text-[9px] px-3 py-1.5 rounded-full font-bold uppercase shadow-md">{item.status}</div>
                        {dist !== null && <div className="absolute top-4 right-4 bg-black/60 text-white text-[9px] px-3 py-1.5 rounded-full font-bold italic backdrop-blur-sm">📍 {dist.toFixed(1)} KM</div>}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-xl uppercase tracking-tight mb-1 text-gray-800 line-clamp-1">{item.name}</h3>
                        <p className="text-2xl md:text-3xl font-black text-[#EE4D2D] mb-6 tracking-tight">Rp {item.price?.toLocaleString()}</p>
                        <div className="flex gap-2">
                          <button className="flex-[3] bg-[#EE4D2D] text-white py-4 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-transform">BELI VIA ESCROW</button>
                          <button onClick={() => window.open(`https://wa.me/${item.wa}`)} className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center active:scale-95 transition-transform">WA</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* VIEW: SELLER */}
        {role === "seller" && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-[3rem] shadow-xl border-t-[8px] border-[#EE4D2D] space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black italic text-center text-[#EE4D2D] uppercase tracking-tighter">Posting Barang</h2>
            <div className="border-2 border-dashed border-gray-200 p-2 rounded-2xl h-44 flex items-center justify-center overflow-hidden bg-gray-50 relative">
              {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" /> : <p className="text-gray-300 font-bold italic text-[10px]">FOTO MATERIAL</p>}
            </div>
            <input type="file" id="up" className="hidden" onChange={handleFileChange} capture="environment" />
            <label htmlFor="up" className="block w-full text-center bg-[#2D3436] text-white py-3 rounded-xl font-bold text-[10px] cursor-pointer active:bg-black transition-colors">AMBIL FOTO</label>
            <div className="space-y-3">
              <input placeholder="Nama Barang" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-semibold text-sm border border-gray-100" onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="Harga Jual" type="number" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-sm text-[#EE4D2D] border border-gray-100" onChange={e => setForm({...form, price: e.target.value})} />
              <input placeholder="Nomor WhatsApp (62...)" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-semibold text-sm border border-gray-100" onChange={e => setForm({...form, wa: e.target.value})} />
              <div className="bg-orange-50/50 p-5 rounded-2xl space-y-3 border border-orange-100">
                <input placeholder="Nama Bank" className="w-full p-3 bg-white rounded-lg outline-none font-semibold text-xs border border-orange-100" onChange={e => setForm({...form, bank: e.target.value})} />
                <input placeholder="No. Rekening" className="w-full p-3 bg-white rounded-lg outline-none font-semibold text-xs border border-orange-100" onChange={e => setForm({...form, rekening: e.target.value})} />
                <input placeholder="Atas Nama" className="w-full p-3 bg-white rounded-lg outline-none font-semibold text-xs border border-orange-100" onChange={e => setForm({...form, atasNama: e.target.value})} />
              </div>
              <button disabled={loading} onClick={handlePublish} className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl mt-4 transition-all ${loading ? 'bg-gray-300' : 'bg-[#EE4D2D] text-white active:scale-95'}`}>{loading ? "MENGIRIM..." : "PUBLIKASIKAN"}</button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-12 opacity-40 font-bold text-[8px] uppercase italic tracking-[0.4em] text-gray-500">Arsitek.sign • 2026</footer>
    </div>
  )
}