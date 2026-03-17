import Link from "next/link"

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        REMATRA Marketplace
      </h1>

      <p className="mt-2">
        Platform jual beli material sisa konstruksi terdekat
      </p>

      <Link
        href="/marketplace"
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Masuk ke Marketplace
      </Link>
    </div>
  )
}