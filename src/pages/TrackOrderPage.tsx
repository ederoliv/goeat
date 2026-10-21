import { useEffect, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Footer } from '../components/Footer';
import { OrderCard } from '../components/OrderCard';
import { CancelOrderButton } from '../components/CancelOrderButton';
import { useAuth } from '../context/AuthContext';
import { isFinalStatus } from '../lib/orderFlow';
import { useRequest } from '../hooks/useRequest';
import { getRestaurant } from '../services/restaurants';
import { trackOrder } from '../services/orders';

const REFRESH_MS = 20_000;

export function TrackOrderPage() {
  const { trackingCode } = useParams({ from: '/track/$trackingCode' });
  const { customer } = useAuth();
  const [version, setVersion] = useState(0);
  const { data: order, loading } = useRequest(() => trackOrder(trackingCode).catch(() => null), [trackingCode, version]);

  // There is no push channel: poll while the order can still change.
  const finished = order ? isFinalStatus(order.status) : false;
  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => setVersion(v => v + 1), REFRESH_MS);
    return () => clearInterval(timer);
  }, [finished]);
  const { data: restaurant } = useRequest(
    async () => (order ? getRestaurant(order.restaurantId) : null),
    [order?.restaurantId],
  );

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#4F4F4F]">
      <nav className="bg-[#19766D] text-white py-3 px-6">
        <div className="max-w-[1280px] mx-auto">
          <Link to="/"><img src="/assets/icon.svg" alt="GoEat" className="h-8" /></Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold mb-6">Acompanhar pedido</h1>
        {loading && !order && <p className="text-[#4F4F4F]/70">Carregando...</p>}
        {!loading && !order && <p>Pedido não encontrado. Confira o código de acompanhamento.</p>}
        {order && (
          <OrderCard order={order} title={restaurant?.name}
            actions={customer && order.customerId === customer.id
              ? <CancelOrderButton order={order} onCancelled={() => setVersion(v => v + 1)} />
              : undefined} />
        )}
        <p className="text-xs text-[#4F4F4F]/70 mt-4">Guarde este link: ele é a única forma de acompanhar pedidos feitos sem conta.</p>
      </main>
      <Footer />
    </div>
  );
}
