import MaterialCard from "./MaterialCard"

interface Material {
  id: number
  title: string
  price: number
  location: string
  image: string
}

interface MaterialGridProps {
  materials: Material[]
}

export default function MaterialGrid({ materials }: MaterialGridProps) {

  return (

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      {materials.map((item) => (

        <MaterialCard
          key={item.id}
          title={item.title}
          price={item.price}
          location={item.location}
          image={item.image}
        />

      ))}

    </div>

  )

}