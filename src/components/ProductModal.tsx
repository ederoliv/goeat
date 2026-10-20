import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../types/api';
import { formatCurrency } from '../lib/format';
import type { StoreInfo } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: MenuItem;
  store: StoreInfo;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, store, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');

  if (!isOpen) return null;


  const itemTotal = product.price * quantity;

  const handleAddToCart = () => {
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      product,
      quantity,
      observation,
      totalPrice: itemTotal
    }, store);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button (Mobile primarily, but visible everywhere) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-500 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Details */}
        <div className="w-full flex flex-col overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="text-center md:text-left mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{product.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-green-600 font-bold text-xl">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            {/* Store Info Banner */}
            <div className="border rounded-lg p-3 mb-6 flex justify-between items-center bg-gray-50">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <span className="truncate">{store.name}</span>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>{store.deliveryFeeText}</span>
              </div>
            </div>


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
              <span>{formatCurrency(itemTotal)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
