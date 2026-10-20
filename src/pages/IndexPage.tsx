import { useState, useEffect, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, ChevronDown, User, ShoppingBag, Star, MapPin, Sandwich, Pizza, Fish, UtensilsCrossed } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useRequest } from '../hooks/useRequest';
import { getRestaurants } from '../services/restaurants';
import { formatCurrency } from '../lib/format';

const cuisineIcons: Record<string, React.ElementType> = {
  Burgers: Sandwich,
  Pizza: Pizza,
  Japanese: Fish,
};

export function IndexPage() {
  const [address, setAddress] = useState<string>("Buscando localização...");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { items, setIsCartOpen } = useCart();
  const { data: restaurants, loading, error } = useRequest(() => getRestaurants(), []);

  const cuisines = useMemo(
    () => Array.from(new Set((restaurants ?? []).map(r => r.cuisine))),
    [restaurants],
  );

  const visibleRestaurants = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (restaurants ?? []).filter(r =>
      (!selectedCuisine || r.cuisine === selectedCuisine) &&
      (!term || r.name.toLowerCase().includes(term) || r.cuisine.toLowerCase().includes(term)),
    );
  }, [restaurants, selectedCuisine, search]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.municipality || "Cidade não encontrada";
              setAddress(city);
            } else {
              setAddress("Endereço não encontrado");
            }
          } catch (error) {
            setAddress("Erro ao buscar endereço");
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          setAddress("Localização não permitida");
        }
      );
    } else {
      setAddress("Geolocalização não suportada");
    }
  }, []);



  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#19766D] text-white py-3 px-6 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center font-bold text-2xl tracking-tight">
              <img src="/assets/icon.svg" alt="GoEat Logo" className="h-8" />
            </div>

            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <a href="#" className="hover:text-green-100 transition-colors">Restaurantes</a>
              <button className="flex items-center gap-1 hover:text-green-100 transition-colors">
                Sobre
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Busque por restaurante ou culinária"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-md py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <button className="flex items-center gap-1 hover:text-green-100 transition-colors max-w-[200px] truncate">
              <MapPin className="w-4 h-4 hidden sm:block shrink-0" />
              <span className="truncate">{address}</span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>

            <button className="hover:text-green-100 transition-colors shrink-0">
              <User className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-green-100 transition-colors shrink-0 relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E5202D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 py-8 flex-1 w-full">
        {/* Categories Section */}
        <section className="mb-12">
          <h1 className="text-[22px] font-bold text-[#4F4F4F] mb-6">
            Pedir seu delivery no Goeat é rápido e prático! Conheça as categorias
          </h1>

          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {cuisines.map((cuisine) => {
              const Icon = cuisineIcons[cuisine] ?? UtensilsCrossed;
              const isSelected = selectedCuisine === cuisine;
              return (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(isSelected ? null : cuisine)}
                  className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group"
                >
                  <div className={`w-24 h-24 rounded-[20px] border transition-colors flex items-center justify-center ${isSelected ? 'bg-[#19766D]/10 border-[#19766D]' : 'bg-[#f7f7f8] group-hover:bg-[#e4ebf0] border-gray-100'}`}>
                    <Icon className="w-10 h-10 text-[#19766D] group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[15px] font-medium text-[#4F4F4F]">{cuisine}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Lojas Section */}
        <section className="bg-[#f7f7f8] -mx-6 px-6 py-10">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-xl font-bold text-[#4F4F4F] mb-6">Lojas</h2>

            {loading && <p className="text-[#4F4F4F]/70">Carregando restaurantes...</p>}
            {!!error && <p className="text-red-500">Não foi possível carregar os restaurantes. Tente novamente mais tarde.</p>}
            {!loading && !error && visibleRestaurants.length === 0 && (
              <p className="text-[#4F4F4F]/70">Nenhum restaurante encontrado.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to="/menu/$restaurantId"
                  params={{ restaurantId: String(restaurant.id) }}
                  className="bg-white rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="shrink-0 w-[84px] h-[84px] rounded-xl bg-[#19766D]/10 border border-gray-100 flex items-center justify-center text-3xl font-bold text-[#19766D]">
                    {restaurant.name.charAt(0)}
                  </div>

                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="font-semibold text-[#4F4F4F] text-base mb-1 truncate" title={restaurant.name}>
                      {restaurant.name}
                    </h3>

                    <div className="flex items-center text-[13px] text-[#4F4F4F]/80 mb-1">
                      <span className="flex items-center text-amber-500 font-medium mr-1.5">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        {restaurant.rating.toFixed(1)}
                      </span>
                      <span className="truncate">• {restaurant.cuisine}</span>
                    </div>

                    <div className="flex items-center text-[13px] text-[#4F4F4F]/80 mb-2">
                      <span>{restaurant.deliveryTimeMinutes} min</span>
                      <span className="mx-1.5">•</span>
                      <span className={restaurant.deliveryFee === 0 ? 'text-[#19766D] font-medium' : ''}>
                        {restaurant.deliveryFee === 0 ? 'Grátis' : formatCurrency(restaurant.deliveryFee)}
                      </span>
                    </div>

                    <span className={`w-fit text-[11px] font-medium px-2 py-1 rounded-md ${restaurant.isOpen ? 'text-[#19766D] bg-[#19766D]/10' : 'text-red-600 bg-red-50'}`}>
                      {restaurant.isOpen ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
