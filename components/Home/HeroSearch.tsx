"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HeroSearch() {
  const [keyword, setKeyword] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Mencegah Hydration Mismatch dengan memastikan komponen sudah termuat di client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = () => {
    if (!keyword.trim()) return
    // Menggunakan router.push agar navigasi lebih cepat tanpa reload halaman penuh
    router.push(`/marketplace?search=${encodeURIComponent(keyword)}`)
  }

  // Menangani tekan tombol "Enter" pada keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Jika belum mounted, kita render UI statis tanpa fungsi interaktif 
  // untuk sinkronisasi awal dengan server
  if (!mounted) {
    return (
      <section className="bg-orange-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Marketplace Material Bangunan Terdekat</h1>
          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 h-12 bg-white border rounded-lg animate-pulse" />
            <div className="w-24 h-12 bg-orange-300 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-orange-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Marketplace Material Bangunan Terdekat
        </h1>

        <p className="text-gray-600 mb-8">
          Temukan material sisa proyek berkualitas dengan harga lebih hemat
        </p>

        <div className="flex gap-3 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Cari bata, semen, besi..."
            className="text-black flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            suppressHydrationWarning // Menghindari error akibat ekstensi browser/autofill
          />

          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            suppressHydrationWarning // Menghindari error akibat ekstensi browser/autofill
          >
            Cari
          </button>
        </div>
      </div>
    </section>
  )
}