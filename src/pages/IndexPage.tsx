import { useState, useEffect } from 'react';
import { Search, ChevronDown, User, ShoppingBag, Star, Ticket, Gift, MapPin, Sandwich, Pizza, IceCream, Tag, UtensilsCrossed, Fish, Soup, Cake, Croissant } from 'lucide-react';

interface Category {
  name: string;
  icon: React.ElementType;
}

interface Promo {
  type: 'present' | 'coupon' | 'free_delivery';
  text: string;
}

interface Store {
  name: string;
  rating: number;
  category: string;
  distance: string;
  time: string;
  fee: string;
  promo?: Promo;
  image: string;
  isSuper?: boolean;
}

export function IndexPage() {
  const [address, setAddress] = useState<string>("Buscando localização...");

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

  const categories: Category[] = [
    { name: "Lanches", icon: Sandwich },
    { name: "Pizza", icon: Pizza },
    { name: "Açaí", icon: IceCream },
    { name: "Promoções", icon: Tag },
    { name: "Brasileira", icon: UtensilsCrossed },
    { name: "Japonesa", icon: Fish },
    { name: "Árabe", icon: Soup },
    { name: "Doces & Bolos", icon: Cake },
    { name: "Pastel", icon: Croissant },
  ];

  const stores: Store[] = [
    { name: "Menu Lanches", rating: 4.6, category: "Lanches", distance: "10.5 km", time: "70-80 min", fee: "R$ 15,00", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=150&h=150&fit=crop" },
    { name: "Pizzaria Belsabore", rating: 4.6, category: "Pizza", distance: "7.2 km", time: "40-50 min", fee: "Grátis", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop" },
    { name: "Dona Iza Açaí", rating: 4.8, category: "Açaí", distance: "8.1 km", time: "80-90 min", fee: "R$ 20,00", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1553530666-ba11a7ddbbbd?w=150&h=150&fit=crop", isSuper: true },
    { name: "Takai Sushi", rating: 4.6, category: "Japonesa", distance: "8.1 km", time: "90-100 min", fee: "R$ 20,00", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&h=150&fit=crop" },
    { name: "Dark Side - Frango Frito", rating: 4.3, category: "Lanches", distance: "8.1 km", time: "60-70 min", fee: "R$ 24,00", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=150&h=150&fit=crop" },
    { name: "La Bella Delivery", rating: 4.6, category: "Pizza", distance: "6.8 km", time: "40-50 min", fee: "Grátis", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=150&h=150&fit=crop" },
    { name: "Dona Iza Doceria", rating: 4.8, category: "Doces & Bolos", distance: "7.5 km", time: "50-60 min", fee: "R$ 15,00", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1481391319762-47dcb7295f71?w=150&h=150&fit=crop", isSuper: true },
    { name: "Pizzaria Cattani", rating: 4.7, category: "Pizza", distance: "6.9 km", time: "40-50 min", fee: "Grátis", promo: { type: 'present', text: 'Presente até R$ 10' }, image: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=150&h=150&fit=crop" },
    { name: "Pizzaria do Vava", rating: 4.7, category: "Pizza", distance: "6.9 km", time: "40-50 min", fee: "Grátis", promo: { type: 'coupon', text: 'Cupom de R$ 5 disponível' }, image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&h=150&fit=crop" },
    { name: "Delícias da Rô - Doc...", rating: 4.9, category: "Doces & Bolos", distance: "8.1 km", time: "51-66 min", fee: "R$ 20,99", promo: { type: 'coupon', text: 'Cupom de R$ 5 disponível' }, image: "https://images.unsplash.com/photo-1509482560494-4126f8225994?w=150&h=150&fit=crop", isSuper: true },
    { name: "Psk Dogs", rating: 4.2, category: "Lanches", distance: "8.8 km", time: "37-52 min", fee: "R$ 19,98", image: "https://images.unsplash.com/photo-1616421575825-7832fb6d0d97?w=150&h=150&fit=crop" },
    { name: "Coruja Rock Burguer...", rating: 4.6, category: "Lanches", distance: "10.0 km", time: "110-120 min", fee: "R$ 24,00", promo: { type: 'free_delivery', text: 'Entrega grátis a partir de R$ 75' }, image: "https://images.unsplash.com/photo-1594212844574-e39cbcc757c2?w=150&h=150&fit=crop" },
  ];

  const getPromoStyle = (type: Promo['type']) => {
    switch (type) {
      case 'present':
        return 'text-purple-600 bg-purple-50';
      case 'coupon':
      case 'free_delivery':
        return 'text-sky-600 bg-sky-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPromoIcon = (type: Promo['type']) => {
    switch (type) {
      case 'present':
        return <Gift className="w-3.5 h-3.5 mr-1" />;
      case 'coupon':
        return <Ticket className="w-3.5 h-3.5 mr-1" />;
      case 'free_delivery':
        return <Ticket className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
                placeholder="Busque por item ou loja"
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
            <button className="hover:text-green-100 transition-colors shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h1 className="text-[22px] font-bold text-[#4F4F4F] mb-6">
            Pedir seu delivery no Goeat é rápido e prático! Conheça as categorias
          </h1>

          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button key={index} className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group">
                  <div className="w-24 h-24 rounded-[20px] bg-[#f7f7f8] group-hover:bg-[#e4ebf0] border border-gray-100 transition-colors flex items-center justify-center">
                    <Icon className="w-10 h-10 text-[#19766D] group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[15px] font-medium text-[#4F4F4F]">{category.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Lojas Section */}
        <section className="bg-[#f7f7f8] -mx-6 px-6 py-10">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-xl font-bold text-[#4F4F4F] mb-6">Lojas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stores.map((store, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="relative shrink-0">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-[84px] h-[84px] object-cover rounded-xl border border-gray-100"
                    />
                    {store.isSuper && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full border-2 border-white shadow-sm z-10">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="font-semibold text-[#4F4F4F] text-base mb-1 truncate" title={store.name}>
                      {store.name}
                    </h3>

                    <div className="flex items-center text-[13px] text-[#4F4F4F]/80 mb-1">
                      <span className="flex items-center text-amber-500 font-medium mr-1.5">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        {store.rating.toFixed(1)}
                      </span>
                      <span className="truncate">• {store.category} • {store.distance}</span>
                    </div>

                    <div className="flex items-center text-[13px] text-[#4F4F4F]/80 mb-2">
                      <span>{store.time}</span>
                      <span className="mx-1.5">•</span>
                      <span className={store.fee === 'Grátis' ? 'text-[#19766D] font-medium' : ''}>
                        {store.fee}
                      </span>
                    </div>

                    {store.promo && (
                      <div className={`flex items-center w-fit text-[11px] font-medium px-2 py-1 rounded-md ${getPromoStyle(store.promo.type)}`}>
                        {getPromoIcon(store.promo.type)}
                        {store.promo.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
