import { useState } from 'react';
import { Search, MapPin, ChevronDown, User, ShoppingBag, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  products: Product[];
}

export function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const menuData: MenuCategory[] = [
    {
      id: "bebidas",
      title: "Bebidas",
      products: [
        { id: "b1", name: "Coca Cola 2L", description: "Refrigerante Coca-Cola sabor original.", price: "R$ 14,00", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&h=150&fit=crop" },
        { id: "b2", name: "Suco Natural de Laranja 500ml", description: "Feito na hora, sem açúcar adicional.", price: "R$ 10,00", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150&h=150&fit=crop" }
      ]
    },
    {
      id: "xis",
      title: "Xis",
      products: [
        { id: "x1", name: "Xis Salada", description: "Pão, maionese, carne, queijo, alface, tomate, milho, ervilha e ovo.", price: "R$ 25,00", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop" },
        { id: "x2", name: "Xis Bacon", description: "Pão, maionese, carne, muito bacon, queijo, alface e ovo.", price: "R$ 30,00", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=150&h=150&fit=crop" },
        { id: "x3", name: "Xis Tudo", description: "Pão, maionese, carne, frango, coração, bacon, calabresa, queijo... o verdadeiro exagero.", price: "R$ 38,00", image: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=150&h=150&fit=crop" }
      ]
    },
    {
      id: "entradas",
      title: "Entradas",
      products: [
        { id: "e1", name: "Porção de Fritas (Média)", description: "Batatas fritas crocantes com sal e orégano. Acompanha molho da casa.", price: "R$ 22,00", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=150&h=150&fit=crop" },
        { id: "e2", name: "Anéis de Cebola (Onion Rings)", description: "Porção com deliciosos anéis de cebola empanados.", price: "R$ 20,00", image: "https://images.unsplash.com/photo-1639024470081-30d075ebf17d?w=150&h=150&fit=crop" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#4F4F4F] relative">
      {/* Container Principal do Restaurante */}
      <div className="max-w-[1020px] mx-auto px-4 pt-4 md:pt-10 z-10 w-full relative">
        
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
             <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-amber-400 p-2 text-center relative overflow-hidden">
               <span className="font-bold text-sm sm:text-base tracking-wide z-10 text-white shadow-black drop-shadow-md">Brunello</span>
               <span className="text-[11px] sm:text-xs text-white z-10">Hamburgueria</span>
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=150&h=150&fit=crop')] opacity-30 object-cover blur-[2px]"></div>
             </div>
          </div>

          {/* Dados (Nome, Avaliação, Endereço) */}
          <div className="pt-2 sm:pt-24 pb-4 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#4F4F4F]">Brunello Hamburgueria</h1>
              <span className="flex items-center text-amber-500 font-bold text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current mr-1" />
                4.6
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 text-sm text-[#4F4F4F]/80">
              <span className="text-red-500 font-bold">Fechado</span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#4F4F4F]" /> Caxias do Sul - RS
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
    </div>
  );
}