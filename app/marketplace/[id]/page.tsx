"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function DetailPage() {
  const params = useParams()
  const id = params?.id // Mengambil ID dari URL
  const router = useRouter()
  
  const [item, setItem] = useState<any>(null)
  const [hasPaid, setHasPaid] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!supabase || !id) return
      
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("id", id)
        .single()

      if (data) setItem(data)
      setLoading(false)
    }
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-400 font-bold">
        Memuat detail material...
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <h1 className="text-xl font-bold text-red-500 mb-4">Material Tidak Ditemukan</h1>
        <button onClick={() => router.push("/Marketplace")} className="text-orange-600 font-bold underline">
          Kembali ke Marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* GHOST HEADER FOR BACK BUTTON */}
      <div className="fixed top-0 left-0 right-0 p-4 flex items-center gap-4 z-50">
        <button 
          onClick={() => router.back()} 
          className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full text-gray-900 active:scale-90 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* GAMBAR UTAMA */}
      <div className="relative w-full aspect-square bg-gray-200">
        <img 
          src={item.image_url} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* KONTEN DETAIL */}
      <div className="relative -mt-8 bg-white rounded-t-[40px] p-6 shadow-2xl min-h-[50vh]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
              {item.title}
            </h1>
            <p className="text-orange-600 font-black text-2xl tracking-tight">
              Rp {item.price.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-100">
            Sisa Proyek
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-t pt-4">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Deskripsi Produk</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              {item.description || "Tidak ada deskripsi tambahan."}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lokasi Seller</h3>
              <p className="text-sm font-bold text-gray-800">Sekitar 15 KM dari Anda</p>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION (ESCROW FLOW) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto">
          {!hasPaid ? (
            <button 
              onClick={() => setHasPaid(true)} 
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-200 active:scale-95 transition-all uppercase tracking-tight"
            >
              Beli & Ambil Sekarang
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="bg-green-600 text-white p-4 rounded-2xl flex items-center gap-3 mb-3 shadow-lg shadow-green-100">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Escrow Aktif</p>
                  <p className="text-sm font-bold">Dana Ditahan Sistem (Aman)</p>
                </div>
              </div>
              <a 
                href={`https://wa.me/${item.phone}?text=Halo, saya sudah melakukan pembayaran untuk sisa material: ${item.title}. Bisa share loc lokasi pengambilan?`}
                target="_blank"
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
              >
                HUBUNGI PENJUAL
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}