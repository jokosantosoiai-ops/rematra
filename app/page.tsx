import HeroSearch from "@/components/Home/HeroSearch"
import ValueProposition from "@/components/Home/ValueProposition"
import HowItWorks from "@/components/Home/HowItWorks"
import MaterialGrid from "@/components/MaterialGrid"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">

      <HeroSearch />

      <ValueProposition />

      <HowItWorks />

      <section className="max-w-6xl mx-auto px-6 py-16">

        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Material Terbaru
          </h2>

          <a
            href="/marketplace"
            className="text-orange-500 hover:underline"
          >
            Lihat Semua
          </a>
        </div>

        <MaterialGrid />

      </section>

    </main>
  )
}