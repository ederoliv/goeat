// Browser geolocation + reverse geocoding (OpenStreetMap Nominatim, not part of the Goeat API).

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocalização não suportada'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
  });
}

// Rejects when the user denies the permission or the city cannot be resolved.
export async function detectCity(): Promise<string> {
  const { latitude, longitude } = (await getPosition()).coords;
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
  const data = await res.json();
  const city = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.municipality;
  if (!city) throw new Error('Cidade não encontrada');
  return city;
}
