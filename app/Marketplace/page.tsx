import { getMaterials } from "@/lib/getMaterials"

export default async function MarketplacePage() {

  const materials = await getMaterials()

  return (
    <div className="grid grid-cols-3 gap-6 p-6">

      {materials.map((item:any) => (

        <div key={item.id} className="border rounded-xl p-4">

          <h2 className="font-bold text-lg">
            {item.title}
          </h2>

          <p className="text-gray-500">
            {item.location}
          </p>

          <p className="text-orange-600 font-semibold">
            Rp {item.price}
          </p>

        </div>

      ))}

    </div>
  )
}