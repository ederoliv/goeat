import { X, Trash2, Edit2, Ticket, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartSidebar() {
  const { items, store, removeItem, subtotal, total, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen && items.length === 0) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full lg:w-[400px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="font-semibold text-gray-800">Seu pedido em</h2>
          </div>
        </div>

        {/* Store Name */}
        {store && (
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <span className="font-bold text-gray-800 text-lg">{store.name}</span>
            <button className="text-[#19766D] text-sm font-medium hover:underline">
              Ver Cardápio
            </button>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-500">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p>Seu carrinho está vazio.</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Itens</h3>
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-800">{item.quantity}x {item.product.name}</span>
                          {item.options.length > 0 && (
                            <ul className="text-sm text-gray-500 mt-1 space-y-0.5">
                              {item.options.map(opt => (
                                <li key={opt.id}>+ {opt.name}</li>
                              ))}
                            </ul>
                          )}
                          {item.observation && (
                            <p className="text-sm text-gray-500 mt-1 italic">"{item.observation}"</p>
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPrice)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-3">
                        <button className="text-[#19766D] font-medium hover:underline flex items-center gap-1">
                          <Edit2 className="w-3.5 h-3.5" /> Editar
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Coupon */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Ticket className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 block">Cupom</span>
                      <span className="text-sm text-gray-500">1 cupom disponível</span>
                    </div>
                  </div>
                  <X className="w-4 h-4 text-gray-400 rotate-45" /> {/* Used as an arrow/chevron here simply */}
                </div>
              </div>
            </div>

            {/* Checkout Footer */}
            <div className="bg-white border-t p-4 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Taxa de entrega</span>
                <span className="text-green-600">{store?.deliveryFee === 0 ? 'Grátis' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(store?.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              </div>

              <button className="w-full bg-[#E5202D] hover:bg-[#D41C28] text-white font-medium rounded-lg h-12 flex items-center justify-center transition-colors shadow-sm mt-4">
                Escolher forma de pagamento
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
