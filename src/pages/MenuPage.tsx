import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { stores } from '../data/stores';
import { Search, MapPin, Star } from 'lucide-react';
import { menuData } from '../data/menu';
import { Footer } from '../components/Footer';

export function MenuPage() {
  const { publicId } = useParams({ strict: false });
  const [searchQuery, setSearchQuery] = useState("");

  const store = stores.find(s => s.publicId === publicId) || stores[0];



  return (
    <div className="min-h-screen bg-white font-sans text-[#4F4F4F] relative flex flex-col">
      {/* Container Principal do Restaurante */}
      <div className="max-w-[1020px] mx-auto px-4 pt-4 md:pt-10 z-10 w-full relative flex-1">
        
        {/* Banner do Restaurante */}
        <div className="w-full h-48 sm:h-56 md:h-64 rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100 mt-0">
          <img 
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=400&fit=crop" 
            alt="Capa do Restaurante" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Cabeçalho de Informações do Restaurante */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start px-4 sm:px-8 -mt-16 sm:-mt-20 relative gap-4">
          
          {/* Logo do Restaurante arredondada */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-[6px] border-white bg-black shadow-md overflow-hidden shrink-0 flex items-center justify-center relative">
            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
          </div>

          {/* Dados (Nome, Avaliação, Endereço) */}
          <div className="pt-2 sm:pt-24 pb-4 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#4F4F4F]">{store.name}</h1>
              <span className="flex items-center text-amber-500 font-bold text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current mr-1" />
                {store.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 text-sm text-[#4F4F4F]/80">
              <span className="text-red-500 font-bold">Fechado</span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#4F4F4F]" /> {store.category} • {store.distance}
              </span>
              <span>•</span>
              <button className="font-bold text-[#19766D] hover:underline">Mais informações</button>
            </div>
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
          {menuData.map((category) => (
            <section key={category.id}>
              {/* Título da Categoria com borda lateral grossa */}
              <h2 className="text-lg font-bold text-[#4F4F4F] mb-6 border-l-[3.5px] border-[#19766D] pl-3.5 leading-none py-0.5">
                {category.title}
              </h2>
              
              {/* Grid de Produtos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.products.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex gap-4 p-4 border border-zinc-100 rounded-xl hover:border-zinc-200 hover:shadow-sm transition-all cursor-pointer bg-white group"
                  >
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-[#4F4F4F] mb-1.5 group-hover:text-[#19766D] transition-colors">{product.name}</h3>
                        <p className="text-[13px] text-[#4F4F4F]/70 line-clamp-3 leading-snug mb-3 pr-2">
                          {product.description}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-[#19766D]">{product.price}</span>
                      </div>
                    </div>
                    
                    {product.image && (
                      <div className="w-[120px] h-[120px] shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-black/5">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        
      </div>
      
      {/* Fundo Verde no topo (Acompanha o scroll) */}
      <div className="absolute top-0 left-0 w-full z-0 h-48 bg-[#19766D] border-b-[4px] border-[#A1EE30]"></div>
      
      <Footer />
    </div>
  );
}