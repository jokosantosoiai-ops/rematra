"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Marketplace() {

  const [materials, setMaterials] = useState<any[]>([])

  useEffect(() => {
    fetchMaterials()
  }, [])

  async function fetchMaterials() {

    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setMaterials(data)
    }
  }

  return (

    <main className="min-h-screen bg-gray-50">

      <section className="bg-orange-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Marketplace Material Sisa Proyek
        </h1>
        <p>
          Temukan material konstruksi berkualitas dengan harga lebih hemat
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">

        <h2 className="text-2xl font-bold mb-8">
          Material Terdekat
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {materials.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >

              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-6">

                <h3 className="text-lg font-semibold mb-2">
                  {item.name}
                </h3>

                <p className="text-orange-600 font-bold text-xl mb-2">
                  Rp {item.price?.toLocaleString()}
                </p>

                <p className="text-gray-500 text-sm mb-4">
                  📍 {item.location} • {item.distance}
                </p>

                <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                  Lihat Detail
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  )
}