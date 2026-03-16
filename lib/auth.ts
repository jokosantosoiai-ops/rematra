// lib/geo.ts
// Utility geolocation untuk REMATRA Marketplace

export type Coordinates = {
  lat: number
  lng: number
}

// --------------------------------------------------
// HITUNG JARAK ANTAR KOORDINAT (HAVERSINE)
// --------------------------------------------------

export function calculateDistance(
  from: Coordinates,
  to: Coordinates
): number {
  const R = 6371 // radius bumi (km)

  const dLat = to.lat * Math.PI / 180 - from.lat * Math.PI / 180
  const dLng = to.lng * Math.PI / 180 - from.lng * Math.PI / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * Math.PI / 180) *
      Math.cos(to.lat * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// --------------------------------------------------
// FORMAT JARAK
// --------------------------------------------------

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }

  return `${distanceKm.toFixed(1)} km`
}

// --------------------------------------------------
// CEK APAKAH DALAM RADIUS
// --------------------------------------------------

export function isWithinRadius(
  origin: Coordinates,
  target: Coordinates,
  radiusKm: number
): boolean {
  const distance = calculateDistance(origin, target)

  return distance <= radiusKm
}

// --------------------------------------------------
// FILTER DATA BERDASARKAN RADIUS
// --------------------------------------------------

export function filterByRadius<T extends { location: Coordinates }>(
  items: T[],
  origin: Coordinates,
  radiusKm: number
): T[] {
  return items.filter((item) =>
    isWithinRadius(origin, item.location, radiusKm)
  )
}

// --------------------------------------------------
// TAMBAH DISTANCE KE DATA LIST
// --------------------------------------------------

export function attachDistance<T extends { location: Coordinates }>(
  items: T[],
  origin: Coordinates
) {
  return items.map((item) => ({
    ...item,
    distance: calculateDistance(origin, item.location),
  }))
}