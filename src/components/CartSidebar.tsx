import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { X, Trash2, Edit2, Ticket, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orders';
import { getAddresses } from '../services/auth';
import { useRequest } from '../hooks/useRequest';
import { formatAddress } from '../lib/address';
import { getErrorMessage } from '../lib/errors';
import { formatCurrency } from '../lib/format';
import { fulfillmentLabels, paymentLabels } from '../lib/labels';
import type { FulfillmentType, Order, PaymentMethod } from '../types/api';

const inputClass =
  'w-full border rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#19766D]';

export function CartSidebar() {
  const { items, store, removeItem, clearCart, subtotal, isCartOpen, setIsCartOpen } = useCart();
  const { customer } = useAuth();
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const { data: savedAddresses } = useRequest(async () => (customer ? getAddresses() : []), [customer?.id]);

  // the primary saved address is the default delivery address
  useEffect(() => {
    const primary = savedAddresses?.find(a => a.isPrimary);
    if (primary) setDeliveryAddress(current => current || formatAddress(primary));
  }, [savedAddresses]);

  const isDelivery = fulfillmentType === 'Delivery';
  const deliveryFee = isDelivery ? store?.deliveryFee ?? 0 : 0;
  const total = subtotal + deliveryFee;
  const canSubmit =
    (!isDelivery || deliveryAddress.trim().length >= 5) &&
    (customer !== null || (guestName.trim().length >= 2 && guestPhone.trim().length >= 8));

  const handleCheckout = async () => {
    if (!store) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        restaurantId: Number(store.id),
        fulfillmentType,
        paymentMethod,
        ...(isDelivery && { deliveryAddress: deliveryAddress.trim() }),
        ...(!customer && { customerName: guestName.trim(), customerPhone: guestPhone.trim() }),
        items: items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
      });
      clearCart();
      setDeliveryAddress('');
      setPlacedOrder(order);
    } catch (e) {
      setError(getErrorMessage(e, 'Não foi possível finalizar o pedido.'));
    } finally {
      setSubmitting(false);
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setPlacedOrder(null);
  };

  if (!isCartOpen && items.length === 0) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeCart}
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
            <button onClick={closeCart} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
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
            {placedOrder ? (
              <div className="text-center space-y-2">
                <p className="font-semibold text-[#19766D]">Pedido #{placedOrder.id} enviado!</p>
                <p className="text-sm">Total: {formatCurrency(placedOrder.total)}</p>
                <Link
                  to="/track/$trackingCode"
                  params={{ trackingCode: placedOrder.trackingCode }}
                  onClick={closeCart}
                  className="text-sm font-medium text-[#19766D] hover:underline block"
                >
                  Acompanhar pedido
                </Link>
                <p className="text-xs text-gray-500">Guarde o link de acompanhamento, principalmente se pediu sem conta.</p>
              </div>
            ) : (
              <p>Seu carrinho está vazio.</p>
            )}
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
            <div className="bg-white border-t p-4 space-y-3 max-h-[55vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(fulfillmentLabels) as FulfillmentType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFulfillmentType(type)}
                    className={`rounded-lg border py-2 text-sm font-medium transition-colors ${fulfillmentType === type ? 'border-[#19766D] bg-[#19766D]/10 text-[#19766D]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {fulfillmentLabels[type]}
                  </button>
                ))}
              </div>

              {isDelivery && (
                <>
                {!!savedAddresses?.length && (
                  <select className={`${inputClass} mb-2`} value="" onChange={e => {
                    const picked = savedAddresses.find(a => a.id === Number(e.target.value));
                    if (picked) setDeliveryAddress(formatAddress(picked));
                  }}>
                    <option value="">Usar um endereço salvo...</option>
                    {savedAddresses.map(a => <option key={a.id} value={a.id}>{a.label}{a.isPrimary ? " (principal)" : ""}</option>)}
                  </select>
                )}
                <textarea
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Endereço de entrega (rua, número, bairro)"
                  rows={2}
                  maxLength={300}
                  className={inputClass}
                />
                </>
              )}

              {!customer && (
                <div className="space-y-2">
                  <input className={inputClass} placeholder="Seu nome" value={guestName} maxLength={150}
                    onChange={e => setGuestName(e.target.value)} />
                  <input className={inputClass} placeholder="Seu telefone" value={guestPhone} maxLength={30}
                    onChange={e => setGuestPhone(e.target.value)} />
                  <p className="text-xs text-gray-500">
                    Pedindo sem conta. <Link to="/login" onClick={closeCart} className="text-[#19766D] font-medium hover:underline">Entrar</Link> para guardar seu histórico.
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 block mb-1">Forma de pagamento (paga na entrega/retirada)</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className={inputClass}
                >
                  {(Object.keys(paymentLabels) as PaymentMethod[]).map(method => (
                    <option key={method} value={method}>{paymentLabels[method]}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {isDelivery && (
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Taxa de entrega</span>
                  <span className="text-green-600">{deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handleCheckout}
                disabled={submitting || !canSubmit}
                className="w-full bg-[#E5202D] hover:bg-[#D41C28] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg h-12 flex items-center justify-center transition-colors shadow-sm"
              >
                {submitting ? 'Enviando...' : 'Finalizar pedido'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
