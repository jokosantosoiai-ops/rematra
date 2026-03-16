type MaterialCardProps = {
  title: string
  price: number
  location: string
  image: string
}

export default function MaterialCard({
  title,
  price,
  location,
  image,
}: MaterialCardProps) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">

      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-t-xl"
      />

      <div className="p-4">

        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <p className="text-orange-600 font-bold">
          Rp {price.toLocaleString()}
        </p>

        <p className="text-gray-500 text-sm">
          {location}
        </p>

      </div>

    </div>
  )
}