import MaterialCard from "./MaterialCard"

export default function MaterialGrid() {

  const materials = [
    {
      id: 1,
      title: "Bata Merah",
      price: 1200,
      location: "Jakarta Selatan",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758"
    },
    {
      id: 2,
      title: "Semen 50kg",
      price: 65000,
      location: "Depok",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
      id: 3,
      title: "Besi Beton 10mm",
      price: 75000,
      location: "Bekasi",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e"
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">

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