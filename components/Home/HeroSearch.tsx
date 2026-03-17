"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSearch() {
  const [keyword, setKeyword] = useState("")
  const router = useRouter()

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!keyword.trim()) return
    router.push(`/marketplace?search=${encodeURIComponent(keyword.trim())}`)
  }

  return (
    <section className="bg-orange-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Marketplace Material Bangunan Terdekat
        </h1>
        <p className="text-gray-600 mb-8">
          Temukan material sisa proyek berkualitas dengan harga lebih hemat
        </p>

        <form 
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto"
          suppressHydrationWarning
        >
          <input
            type="text"
            placeholder="Cari bata, semen, besi..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-orange-500 outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            suppressHydrationWarning
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 active:scale-95 transition-all font-bold"
            suppressHydrationWarning
          >
            Cari
          </button>
        </form>
      </div>
    </section>
  )
}