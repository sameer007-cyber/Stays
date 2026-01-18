import fetch from "node-fetch";

export async function geocodeLocation(location, country) {
  const query = encodeURIComponent(`${location}, ${country}`);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.MAPBOX_TOKEN}&limit=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features || data.features.length === 0) {
    return { latitude: null, longitude: null };
  }

  const [longitude, latitude] = data.features[0].center;

  return { latitude, longitude };
}
