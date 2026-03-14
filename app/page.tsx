"use client"

import { useState } from "react"

export default function Home() {

  const [role, setRole] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">

      {/* HEADER */}

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <h1 className="text-3xl font-bold text-orange-600">
            REMATRA
          </h1>

          <nav className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-orange-500">Home</a>
            <a href="#" className="hover:text-orange-500">Marketplace</a>
            <a href="#" className="hover:text-orange-500">Cara Kerja</a>
            <a href="#" className="hover:text-orange-500">Login</a>
          </nav>

        </div>
      </header>


      {/* HERO SECTION */}

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">

        <h2 className="text-5xl font-bold leading-tight mb-6">
          Marketplace Material Sisa Konstruksi
        </h2>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Platform untuk membeli dan menjual material sisa proyek konstruksi
          secara aman menggunakan sistem rekening bersama dan transaksi lokal
          berbasis radius.
        </p>


        {/* CTA BUTTON */}

        <div className="flex justify-center gap-6 flex-wrap">

          <button
            onClick={() => setRole("pembeli")}
            className="bg-orange-500 text-white text-lg px-10 py-4 rounded-xl hover:bg-orange-600 transition shadow-md"
          >
            Saya Pembeli
          </button>

          <button
            onClick={() => setRole("penjual")}
            className="bg-gray-900 text-white text-lg px-10 py-4 rounded-xl hover:bg-black transition shadow-md"
          >
            Saya Penjual
          </button>

        </div>

      </section>


      {/* STATS */}

      <section className="bg-white border-y">

        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12 text-center">

          <div>
            <h3 className="text-4xl font-bold text-orange-500 mb-2">
              10K+
            </h3>
            <p className="text-gray-600">
              Material tersedia
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-orange-500 mb-2">
              5K+
            </h3>
            <p className="text-gray-600">
              Pengguna aktif
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-orange-500 mb-2">
              15KM
            </h3>
            <p className="text-gray-600">
              Radius transaksi lokal
            </p>
          </div>

        </div>

      </section>


      {/* FITUR PEMBELI */}

      {role === "pembeli" && (

        <section className="max-w-7xl mx-auto px-6 py-20">

          <h3 className="text-3xl font-bold text-center mb-14">
            Fitur Pembeli
          </h3>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-3">
                Cari Material
              </h4>
              <p className="text-gray-600">
                Temukan material sisa proyek seperti keramik, besi,
                cat, kabel, kayu, dan banyak lagi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-3">
                Filter Radius 15KM
              </h4>
              <p className="text-gray-600">
                Sistem menampilkan material terdekat
                untuk menghemat biaya transportasi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-3">
                Pembayaran Aman
              </h4>
              <p className="text-gray-600">
                Pembayaran melalui sistem rekening bersama
                sebelum material diambil.
              </p>
            </div>

          </div>

        </section>

      )}


      {/* FITUR PENJUAL */}

      {role === "penjual" && (

        <section className="max-w-7xl mx-auto px-6 py-20">

          <h3 className="text-3xl font-bold text-center mb-14">
            Fitur Penjual
          </h3>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-3">
                Upload Material
              </h4>
              <p className="text-gray-600">
                Upload foto material sisa proyek dengan mudah
                langsung dari lokasi proyek.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-3">
                Harga Fleksibel
              </h4>
              <p className="text-gray-600">
                Tentukan harga jual sesuai kondisi
                material dan kebutuhan Anda.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-3">
                Jual Lebih Cepat
              </h4>
              <p className="text-gray-600">
                Jangkau pembeli lokal di sekitar lokasi proyek
                dalam radius transaksi.
              </p>
            </div>

          </div>

        </section>

      )}


      {/* HOW IT WORKS */}

      <section className="bg-gray-100">

        <div className="max-w-7xl mx-auto px-6 py-20">

          <h3 className="text-3xl font-bold text-center mb-16">
            Cara Kerja REMATRA
          </h3>

          <div className="grid md:grid-cols-4 gap-10 text-center">

            <div>
              <div className="text-3xl font-bold text-orange-500 mb-3">1</div>
              <p>Upload atau cari material</p>
            </div>

            <div>
              <div className="text-3xl font-bold text-orange-500 mb-3">2</div>
              <p>Setujui harga transaksi</p>
            </div>

            <div>
              <div className="text-3xl font-bold text-orange-500 mb-3">3</div>
              <p>Bayar melalui rek. bersama</p>
            </div>

            <div>
              <div className="text-3xl font-bold text-orange-500 mb-3">4</div>
              <p>Material diambil pembeli</p>
            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="bg-gray-900 text-gray-300">

        <div className="max-w-7xl mx-auto px-6 py-12 text-center">

          <p className="mb-3">
            © {new Date().getFullYear()} REMATRA
          </p>

          <p className="text-gray-500">
            Marketplace Material Sisa Konstruksi
          </p>

        </div>

      </footer>

    </main>
  )
}