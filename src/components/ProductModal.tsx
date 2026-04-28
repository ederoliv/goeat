import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Product, ProductOption } from '../data/menu';
import type { StoreInfo } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product;
  store: StoreInfo;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, store, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);
  const [observation, setObservation] = useState('');

  if (!isOpen) return null;

  const handleOptionToggle = (option: ProductOption) => {
    setSelectedOptions(prev => {
      const isSelected = prev.find(o => o.id === option.id);
      if (isSelected) {
        return prev.filter(o => o.id !== option.id);
      }
      if (prev.length >= 5) {
        return prev; // limit to 5 options as requested in screenshot
      }
      return [...prev, option];
    });
  };

  const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
  const itemTotal = (product.priceNumber + optionsTotal) * quantity;

  const handleAddToCart = () => {
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      product,
      quantity,
      options: selectedOptions,
      observation,
      totalPrice: itemTotal
    }, store);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button (Mobile primarily, but visible everywhere) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-500 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image (Desktop only mostly, or top on mobile) */}
        <div className="w-full md:w-1/2 h-48 md:h-auto bg-gray-100">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Details & Options */}
        <div className="w-full md:w-1/2 flex flex-col h-[calc(90vh-12rem)] md:h-auto overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="text-center md:text-left mb-6">
              <span className="text-[#19766D] text-xs font-semibold uppercase tracking-wider mb-2 block">Item promocional</span>
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{product.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-green-600 font-bold text-xl">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.priceNumber)}
                </span>
              </div>
            </div>

            {/* Store Info Banner */}
            <div className="border rounded-lg p-3 mb-6 flex justify-between items-center bg-gray-50">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <span className="truncate">{store.name}</span>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>{store.deliveryFeeText || "Grátis"}</span>
              </div>
            </div>

            {/* Options Section */}
            {product.options && product.options.length > 0 && (
              <div className="mb-6">
                <div className="bg-gray-100 p-3 rounded-t-lg border-b">
                  <h3 className="font-semibold text-gray-800">Gostaria de algo a mais no seu lanche?</h3>
                  <p className="text-xs text-gray-500">Escolha até 5 opções.</p>
                </div>
                <div className="border border-t-0 rounded-b-lg divide-y">
                  {product.options.map((option) => {
                    const isSelected = selectedOptions.some(o => o.id === option.id);
                    return (
                      <label key={option.id} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleOptionToggle(option)}
                            className="w-4 h-4 text-[#19766D] border-gray-300 rounded focus:ring-[#19766D]"
                          />
                          <span className="text-sm text-gray-700">{option.name}</span>
                        </div>
                        <span className="text-sm text-[#19766D] font-medium">
                          + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Observation */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Alguma observação?</h3>
              <textarea 
                placeholder="Ex: Tirar cebola, maionese à parte..."
                value={observation}
                onChange={e => setObservation(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#19766D]"
                rows={2}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t p-4 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between sticky bottom-0">
            {/* Quantity Controls */}
            <div className="flex items-center border rounded-lg h-12 w-full sm:w-auto">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 text-[#19766D] hover:bg-gray-100 h-full rounded-l-lg transition-colors flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-gray-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 text-[#19766D] hover:bg-gray-100 h-full rounded-r-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 w-full bg-[#E5202D] hover:bg-[#D41C28] text-white font-medium rounded-lg h-12 flex items-center justify-between px-6 transition-colors shadow-sm"
            >
              <span>Adicionar</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemTotal)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
