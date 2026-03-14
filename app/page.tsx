"use client"

import { useState } from "react"

export default function Home() {

  const [role, setRole] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">

      {/* HEADER */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-2xl font-bold text-orange-600">
            REMATRA
          </h1>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-orange-500 transition">Home</a>
            <a href="#" className="hover:text-orange-500 transition">Marketplace</a>
            <a href="#" className="hover:text-orange-500 transition">Cara Kerja</a>
            <a href="#" className="hover:text-orange-500 transition">Login</a>
          </nav>

        </div>
      </header>


      {/* HERO */}
      <section className="flex-1">

        <div className="max-w-6xl mx-auto px-6 py-16 text-center">

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Marketplace Material Sisa Konstruksi
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Platform untuk menjual dan membeli material sisa proyek konstruksi
            secara aman menggunakan sistem rekening bersama.
          </p>

          {/* ROLE SELECT */}
          <div className="flex justify-center gap-6 flex-wrap">

            <button
              onClick={() => setRole("pembeli")}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
            >
              Saya Pembeli
            </button>

            <button
              onClick={() => setRole("penjual")}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition"
            >
              Saya Penjual
            </button>

          </div>

        </div>

      </section>


      {/* FITUR PEMBELI */}
      {role === "pembeli" && (

        <section className="max-w-6xl mx-auto px-6 py-12 w-full">

          <h3 className="text-2xl font-semibold mb-8 text-center">
            Fitur Pembeli
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">
                Cari Material
              </h4>

              <p className="text-sm text-gray-600">
                Temukan material sisa proyek seperti keramik, besi,
                cat, kabel, dan lainnya.
              </p>
            </div>


            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">
                Filter Radius 15KM
              </h4>

              <p className="text-sm text-gray-600">
                Sistem menampilkan material terdekat
                untuk menghemat biaya transportasi.
              </p>
            </div>


            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">
                Pembayaran Aman
              </h4>

              <p className="text-sm text-gray-600">
                Pembayaran melalui rekening bersama
                sebelum barang diambil.
              </p>
            </div>

          </div>

        </section>

      )}


      {/* FITUR PENJUAL */}
      {role === "penjual" && (

        <section className="max-w-6xl mx-auto px-6 py-12 w-full">

          <h3 className="text-2xl font-semibold mb-8 text-center">
            Fitur Penjual
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">
                Upload Material
              </h4>

              <p className="text-sm text-gray-600">
                Foto dan deskripsikan material sisa proyek Anda.
              </p>
            </div>


            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">
                Harga Fleksibel
              </h4>

              <p className="text-sm text-gray-600">
                Tentukan harga jual sesuai kondisi material.
              </p>
            </div>


            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">
                Jual Lebih Cepat
              </h4>

              <p className="text-sm text-gray-600">
                Jangkau pembeli di sekitar lokasi proyek Anda.
              </p>
            </div>

          </div>

        </section>

      )}


      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">

        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-sm">

          <p className="mb-2">
            © {new Date().getFullYear()} REMATRA
          </p>

          <p className="text-gray-500">
            Platform Marketplace Material Sisa Konstruksi
          </p>

        </div>

      </footer>

    </main>
  )
}