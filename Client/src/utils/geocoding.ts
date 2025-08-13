import { LatLngExpression } from 'leaflet';

const MAPTILER_API_KEY = 'UZq3MGzKrUuo8QWddqqK';

export const geocodeAddress = async (address: string): Promise<LatLngExpression | null> => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.maptiler.com/geocoding/${encodedAddress}.json?key=${MAPTILER_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const { center } = data.features[0];
      return [center[1], center[0]];
    }

    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};