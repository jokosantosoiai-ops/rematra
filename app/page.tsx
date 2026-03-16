import HeroSearch from "@/components/Home/HeroSearch"
import MaterialGrid from "@/components/MaterialGrid"

export default function Home() {

  const materials = [
    {
      id: 1,
      title: "Kayu Bekisting",
      price: 150000,
      location: "Bogor",
      image: "https://images.unsplash.com/photo-1581092160607-ee22731a5c6c"
    },
    {
      id: 2,
      title: "Besi Hollow",
      price: 350000,
      location: "Depok",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e"
    },
    {
      id: 3,
      title: "Keramik Sisa Proyek",
      price: 200000,
      location: "Jakarta",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
      id: 4,
      title: "Batu Bata Merah",
      price: 80000,
      location: "Bandung",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101"
    }
  ]

  return (

    <main className="min-h-screen bg-gray-50">

      {/* HERO SEARCH */}
      <HeroSearch />

      {/* CATEGORY SECTION */}
      <section className="max-w-6xl mx-auto py-12 px-6">

        <h2 className="text-2xl font-bold mb-6">
          Kategori Material
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            Beton
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            Kayu
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            Besi
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            Keramik
          </div>

        </div>

      </section>

      {/* MATERIAL GRID */}
      <section className="max-w-6xl mx-auto py-12 px-6">

        <h2 className="text-2xl font-bold mb-6">
          Material Terdekat
        </h2>

        <MaterialGrid materials={materials} />

      </section>

      {/* CTA SELL MATERIAL */}
      <section className="bg-orange-500 text-white py-16 mt-10">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-4">
            Punya Material Sisa Proyek?
          </h2>

          <p className="mb-6">
            Jual material Anda di REMATRA dan temukan pembeli di sekitar proyek Anda.
          </p>

          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Upload Material
          </button>

        </div>

      </section>

    </main>

  )

}