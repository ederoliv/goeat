import { Link, useParams } from '@tanstack/react-router';
import { Footer } from '../components/Footer';
import { OrderCard } from '../components/OrderCard';
import { useRequest } from '../hooks/useRequest';
import { getRestaurant } from '../services/restaurants';
import { trackOrder } from '../services/orders';

export function TrackOrderPage() {
  const { trackingCode } = useParams({ from: '/track/$trackingCode' });
  const { data: order, loading } = useRequest(() => trackOrder(trackingCode).catch(() => null), [trackingCode]);
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
        {loading && <p className="text-[#4F4F4F]/70">Carregando...</p>}
        {!loading && !order && <p>Pedido não encontrado. Confira o código de acompanhamento.</p>}
        {order && <OrderCard order={order} title={restaurant?.name} />}
        <p className="text-xs text-[#4F4F4F]/70 mt-4">Guarde este link: ele é a única forma de acompanhar pedidos feitos sem conta.</p>
      </main>
      <Footer />
    </div>
  );
}
