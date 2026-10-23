import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LocateFixed, MapPin } from 'lucide-react';
import { searchCities } from '../lib/citySearch';
import { useRequest } from '../hooks/useRequest';
import { getRestaurantCities } from '../services/restaurants';
import type { CityStatus } from '../hooks/useUserCity';

interface CitySelectorProps {
  city: string | null;
  status: CityStatus;
  onSelect: (city: string) => void;
  onUseMyLocation: () => void;
  // Opens the list on its own, e.g. when geolocation was denied and the user has to choose.
  forceOpen?: boolean;
}

export function CitySelector({ city, status, onSelect, onUseMyLocation, forceOpen }: CitySelectorProps) {
  const [opened, setOpened] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = opened || (!!forceOpen && !dismissed);
  const setOpen = (value: boolean) => { setOpened(value); if (!value) setDismissed(true); };
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { data: cities, loading, error } = useRequest(() => getRestaurantCities(), []);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const matches = searchCities(cities ?? [], query);

  const label = status === 'detecting' ? 'Buscando localização...' : city ?? 'Selecione sua cidade';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-green-100 transition-colors max-w-[200px] truncate"
      >
        <MapPin className="w-4 h-4 hidden sm:block shrink-0" />
        <span className="truncate">{label}</span>
        <ChevronDown className="w-4 h-4 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white text-[#4F4F4F] rounded-xl shadow-lg border border-gray-100 p-2 z-50">
          {status === 'unavailable' && (
            <p className="px-3 py-2 text-xs text-[#4F4F4F]/70">
              Não foi possível obter sua localização. Escolha sua cidade abaixo.
            </p>
          )}

          <button
            onClick={() => { onUseMyLocation(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#19766D] font-medium hover:bg-[#19766D]/10"
          >
            <LocateFixed className="w-4 h-4" />
            Usar minha localização
          </button>

          <div className="my-1 border-t border-gray-100" />

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar cidade"
            aria-label="Buscar cidade"
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#19766D]"
          />

          {loading && <p className="px-3 py-2 text-sm text-[#4F4F4F]/70">Carregando cidades...</p>}
          {!!error && <p className="px-3 py-2 text-sm text-red-500">Não foi possível carregar as cidades.</p>}
          {!loading && !error && cities?.length === 0 && (
            <p className="px-3 py-2 text-sm text-[#4F4F4F]/70">Nenhuma cidade disponível ainda.</p>
          )}
          {!loading && !error && !!cities?.length && !query.trim() && (
            <p className="px-3 py-2 text-xs text-[#4F4F4F]/70">Digite o nome da sua cidade.</p>
          )}
          {!!query.trim() && !!cities?.length && matches.length === 0 && (
            <p className="px-3 py-2 text-sm text-[#4F4F4F]/70">Nenhuma cidade encontrada.</p>
          )}

          <ul>
            {matches.map(c => (
              <li key={c}>
                <button
                  onClick={() => { onSelect(c); setQuery(''); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#f7f7f8] ${c === city ? 'font-semibold text-[#19766D]' : ''}`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
