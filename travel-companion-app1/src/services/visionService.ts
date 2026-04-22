import { Landmark } from '../data/landmarks';

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function findNearbyPlaces(
  userLat: number,
  userLon: number,
  places: Landmark[],
  radiusKm = 30
){
  return places.filter(place => {
    const d = distanceKm(
      userLat,
      userLon,
      place.latitude,
      place.longitude
    );
    return d <= radiusKm;
  });
}
