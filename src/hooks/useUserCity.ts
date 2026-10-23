import { useCallback, useEffect, useState } from 'react';
import { detectCity } from '../services/geolocation';

const CITY_KEY = 'goeat.city';

function readStoredCity(): string | null {
  try {
    return localStorage.getItem(CITY_KEY);
  } catch {
    return null;
  }
}

function storeCity(city: string | null) {
  try {
    if (city) localStorage.setItem(CITY_KEY, city);
    else localStorage.removeItem(CITY_KEY);
  } catch {
    // storage unavailable: the choice just won't be remembered
  }
}

export type CityStatus = 'detecting' | 'ready' | 'unavailable';

// The city is the one the user picked manually (remembered), otherwise the one detected by geolocation.
// 'unavailable' means detection failed or was denied and the user must pick a city.
export function useUserCity() {
  const [city, setCity] = useState<string | null>(readStoredCity);
  const [status, setStatus] = useState<CityStatus>(() => (readStoredCity() ? 'ready' : 'detecting'));

  const runDetection = useCallback(() => {
    detectCity().then(
      detected => { setCity(detected); setStatus('ready'); },
      () => setStatus('unavailable'),
    );
  }, []);

  // The initial status is already 'detecting' when there is no stored city.
  useEffect(() => {
    if (!readStoredCity()) runDetection();
  }, [runDetection]);

  const selectCity = useCallback((selected: string) => {
    storeCity(selected);
    setCity(selected);
    setStatus('ready');
  }, []);

  // Forgets the manual choice and tries geolocation again.
  const useMyLocation = useCallback(() => {
    storeCity(null);
    setCity(null);
    setStatus('detecting');
    runDetection();
  }, [runDetection]);

  return { city, status, selectCity, useMyLocation };
}
