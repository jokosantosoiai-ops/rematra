export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-10">
          Cara Kerja REMATRA
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <div>
            <h3 className="font-semibold">Upload Material</h3>
            <p className="text-gray-600 text-sm">
              Penjual upload material sisa proyek
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Pembeli Cari</h3>
            <p className="text-gray-600 text-sm">
              Cari material di sekitar lokasi Anda
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Bayar Escrow</h3>
            <p className="text-gray-600 text-sm">
              Pembayaran melalui rekening bersama
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Material Dikirim</h3>
            <p className="text-gray-600 text-sm">
              Ambil sendiri atau kirim kurir
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}