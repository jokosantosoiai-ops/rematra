"use client"

import { useState } from "react"

export default function HeroSearch() {

  const [keyword, setKeyword] = useState("")

  const handleSearch = () => {
    if (!keyword) return
    window.location.href = `/marketplace?search=${keyword}`
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
            className="flex-1 border rounded-lg px-4 py-3"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Cari
          </button>

        </div>

      </div>

    </section>
  )
}