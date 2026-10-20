import { Link } from '@tanstack/react-router';
import { Footer } from '../components/Footer';
import { OrderCard } from '../components/OrderCard';
import { useAuth } from '../context/AuthContext';
import { useRequest } from '../hooks/useRequest';
import { getRestaurants } from '../services/restaurants';
import { getOrders } from '../services/orders';

export function OrdersPage() {
  const { customer, loading: loadingAuth } = useAuth();
  const { data: orders, loading, error } = useRequest(
    async () => (customer ? getOrders() : []),
    [customer?.id],
  );
  const { data: restaurants } = useRequest(() => getRestaurants(), []);
  const restaurantName = (id: number) => restaurants?.find(r => r.id === id)?.name ?? `Restaurante #${id}`;

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#4F4F4F]">
      <nav className="bg-[#19766D] text-white py-3 px-6">
        <div className="max-w-[1280px] mx-auto">
          <Link to="/"><img src="/assets/icon.svg" alt="GoEat" className="h-8" /></Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold mb-6">Meus pedidos</h1>

        {!loadingAuth && !customer && (
          <p>
            <Link to="/login" className="font-bold text-[#19766D] hover:underline">Entre</Link> para ver seus pedidos.
            Fez um pedido sem conta? Use o link de acompanhamento que recebeu ao finalizar.
          </p>
        )}
        {(loadingAuth || loading) && customer !== null && <p className="text-[#4F4F4F]/70">Carregando...</p>}
        {!!error && <p className="text-red-500">Não foi possível carregar os pedidos.</p>}
        {customer && !loading && !error && orders?.length === 0 && <p className="text-[#4F4F4F]/70">Você ainda não fez pedidos.</p>}

        <div className="space-y-4">
          {orders?.map(order => (
            <div key={order.id}>
              <OrderCard order={order} title={restaurantName(order.restaurantId)} />
              <Link to="/track/$trackingCode" params={{ trackingCode: order.trackingCode }}
                className="text-xs font-medium text-[#19766D] hover:underline">
                Acompanhar pedido
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
