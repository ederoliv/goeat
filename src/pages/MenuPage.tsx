import { useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Search, Clock, Star, ShoppingBag, MapPin } from 'lucide-react';
import type { Product } from '../types/api';
import { Footer } from '../components/Footer';
import { Avatar } from '../components/Avatar';
import { formatAddress } from '../lib/address';
import { ProductModal } from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import { useRequest } from '../hooks/useRequest';
import { getMenu, getRestaurant } from '../services/restaurants';
import { formatCurrency } from '../lib/format';

export function MenuPage() {
  const { restaurantId } = useParams({ from: '/menu/$restaurantId' });
  const id = Number(restaurantId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { items, total, isCartOpen, setIsCartOpen } = useCart();

  const { data: restaurant, loading: loadingRestaurant, error: restaurantError } =
    useRequest(() => getRestaurant(id), [id]);
  const { data: menu, loading: loadingMenu, error: menuError } =
    useRequest(() => getMenu(id), [id]);

  const sections = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return [...(menu?.sections ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(section => ({
        id: section.id,
        title: section.name,
        products: section.products.filter(p =>
          !term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)),
      }))
      .filter(section => section.products.length > 0);
  }, [menu, searchQuery]);

  if (loadingRestaurant) {
    return <div className="min-h-screen flex items-center justify-center text-[#4F4F4F]">Carregando...</div>;
  }

  if (restaurantError || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#4F4F4F]">
        <p>Restaurante não encontrado.</p>
        <Link to="/" className="font-bold text-[#19766D] hover:underline">Voltar para a home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#4F4F4F] relative flex flex-col">
      {/* Container Principal do Restaurante */}
      <div className="max-w-[1020px] mx-auto px-4 pt-4 md:pt-10 z-10 w-full relative flex-1">

        {/* Cabeçalho de Informações do Restaurante */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start px-4 sm:px-8 mt-10 relative gap-4">

          {/* Logo do Restaurante (inicial, enquanto a API não fornece imagem) */}
          <Avatar name={restaurant.name} imageUrl={restaurant.profileImageUrl}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-[6px] border-white bg-[#A1EE30] shadow-md shrink-0 text-5xl font-extrabold text-[#19766D]" />

          {/* Dados (Nome, Avaliação, Entrega) */}
          <div className="pt-2 sm:pt-32 pb-4 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#4F4F4F]">{restaurant.name}</h1>
              <span className="flex items-center text-amber-500 font-bold text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current mr-1" />
                {restaurant.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 text-sm text-[#4F4F4F]/80">
              <span className={restaurant.isOpen ? 'text-[#19766D] font-bold' : 'text-red-500 font-bold'}>
                {restaurant.isOpen ? 'Aberto' : 'Fechado'}
              </span>
              <span>•</span>
              <span>{restaurant.cuisine}</span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" /> {restaurant.deliveryTimeMinutes} min
              </span>
              <span>•</span>
              <span>{restaurant.deliveryFee === 0 ? 'Entrega grátis' : `Entrega ${formatCurrency(restaurant.deliveryFee)}`}</span>
            </div>
            {restaurant.address && (
              <p className="flex items-center justify-center sm:justify-start gap-1 mt-1.5 text-sm text-[#4F4F4F]/70">
                <MapPin className="w-4 h-4 shrink-0" /> {formatAddress(restaurant.address)}
              </p>
            )}
          </div>
        </div>

        {/* Campo de Busca do Cardápio */}
        <div className="max-w-xl mx-auto mt-8 mb-4 px-4 sm:px-0">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no cardápio"
              className="w-full border border-gray-200 shadow-sm text-[#4F4F4F] rounded-lg py-2.5 pl-11 pr-4 outline-none focus:border-[#19766D] focus:ring-1 focus:ring-[#19766D] transition-all"
            />
          </div>
        </div>

        {/* Listagem de Categorias e Produtos */}
        <div className="space-y-14 px-2 sm:px-8 mt-12 pb-24">
          {loadingMenu && <p className="text-center text-[#4F4F4F]/70">Carregando cardápio...</p>}
          {!!menuError && <p className="text-center text-red-500">Não foi possível carregar o cardápio.</p>}
          {!loadingMenu && !menuError && sections.length === 0 && (
            <p className="text-center text-[#4F4F4F]/70">Nenhum item encontrado.</p>
          )}

          {sections.map((section) => (
            <section key={section.id}>
              {/* Título da Categoria com borda lateral grossa */}
              <h2 className="text-lg font-bold text-[#4F4F4F] mb-6 border-l-[3.5px] border-[#19766D] pl-3.5 leading-none py-0.5">
                {section.title}
              </h2>

              {/* Grid de Produtos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {section.products.map((product) => {
                  const canOrder = product.isAvailable && restaurant.isOpen;
                  return (
                    <div
                      key={product.id}
                      onClick={() => canOrder && setSelectedProduct(product)}
                      className={`flex gap-4 p-4 border border-zinc-100 rounded-xl transition-all bg-white group ${canOrder ? 'hover:border-zinc-200 hover:shadow-sm cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                    >
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className={`font-medium text-[#4F4F4F] mb-1.5 transition-colors ${canOrder ? 'group-hover:text-[#19766D]' : ''}`}>{product.name}</h3>
                          <p className="text-[13px] text-[#4F4F4F]/70 line-clamp-3 leading-snug mb-3 pr-2">
                            {product.description}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[#19766D]">{formatCurrency(product.price)}</span>
                          {!product.isAvailable && <span className="ml-3 text-xs font-medium text-red-500">Indisponível</span>}
                        </div>
                      </div>
                      {product.imageUrl && (
                        <div className="w-[120px] h-[120px] shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-black/5">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>

      {/* Fundo Verde no topo (Acompanha o scroll) */}
      <div className="absolute top-0 left-0 w-full z-0 h-48 bg-[#19766D] border-b-[4px] border-[#A1EE30]"></div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          store={{
            id: String(restaurant.id),
            name: restaurant.name,
            deliveryFee: restaurant.deliveryFee,
            deliveryFeeText: restaurant.deliveryFee === 0 ? 'Grátis' : formatCurrency(restaurant.deliveryFee),
          }}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Floating Cart Button */}
      {items.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full max-w-md bg-[#19766D] text-white font-medium rounded-xl h-14 flex items-center justify-between px-6 shadow-xl hover:bg-[#135c55] transition-colors pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span className="bg-white/20 px-2.5 py-0.5 rounded text-sm">{items.length}</span>
            </div>
            <span>Ver sacola</span>
            <span>{formatCurrency(total)}</span>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
