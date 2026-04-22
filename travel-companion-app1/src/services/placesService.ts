const GOOGLE_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

export async function fetchNearbyLandmarks(
  latitude: number,
  longitude: number
) {
  const radius = 1500; // meters

  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${latitude},${longitude}` +
    `&radius=${radius}` +
    `&type=tourist_attraction` +
    `&key=${GOOGLE_API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.results) return [];

  return json.results.map((item: any) => ({
    id: item.place_id,
    name: item.name,
    lat: item.geometry.location.lat,
    lng: item.geometry.location.lng,
  }));
}
