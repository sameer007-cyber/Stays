/**
 * Convert location + country → latitude & longitude
 * Uses native fetch (Node 18+)
 */
export async function geocodeLocation(location, country) {
  if (!location) {
    return { latitude: null, longitude: null };
  }

  const query = encodeURIComponent(
    country ? `${location}, ${country}` : location
  );

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "stays-app/1.0",
    },
  });

  if (!res.ok) {
    throw new Error("Geocoding request failed");
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    return { latitude: null, longitude: null };
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  };
}
