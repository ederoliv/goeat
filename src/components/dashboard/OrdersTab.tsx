import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { OrderCard } from '../OrderCard';
import { useRequest } from '../../hooks/useRequest';
import { getReceivedOrders, updateOrderStatus } from '../../services/restaurants';
import { advanceLabels, nextStatus, restaurantCanCancel } from '../../lib/orderFlow';
import { getErrorMessage } from '../../lib/errors';
import { orderStatusLabels } from '../../lib/labels';
import { formatCurrency } from '../../lib/format';
import { inputClass, primaryButton, secondaryButton } from './styles';
import type { Order, OrderStatus } from '../../types/api';

const REFRESH_MS = 30_000;

export function OrdersTab() {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [version, setVersion] = useState(0);
  const { data: orders, loading, error } = useRequest(
    () => getReceivedOrders(status || undefined),
    [status, version],
  );

  // New orders arrive while the dashboard is open.
  useEffect(() => {
    const timer = setInterval(() => setVersion(v => v + 1), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const pending = orders?.filter(o => o.status === 'Pending').length ?? 0;
  const revenue = orders?.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0) ?? 0;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Pedidos" value={String(orders?.length ?? 0)} />
        <Stat label="Aguardando confirmação" value={String(pending)} />
        <Stat label="Valor (sem cancelados)" value={formatCurrency(revenue)} />
      </div>

      <div className="flex gap-3 items-center">
        <select className={`${inputClass} max-w-xs`} value={status} onChange={e => setStatus(e.target.value as OrderStatus | '')}>
          <option value="">Todos os status</option>
          {(Object.keys(orderStatusLabels) as OrderStatus[]).map(s => (
            <option key={s} value={s}>{orderStatusLabels[s]}</option>
          ))}
        </select>
        <button className={`${secondaryButton} flex items-center gap-2`} onClick={() => setVersion(v => v + 1)}>
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      <p className="text-xs text-[#4F4F4F]/70">
        A lista atualiza sozinha a cada 30 segundos. Avance o pedido uma etapa por vez; só dá para cancelar até o início do preparo.
      </p>

      {loading && !orders && <p className="text-[#4F4F4F]/70">Carregando pedidos...</p>}
      {!!error && <p className="text-red-500">Não foi possível carregar os pedidos.</p>}
      {orders?.length === 0 && <p className="text-[#4F4F4F]/70">Nenhum pedido por aqui.</p>}

      <div className="space-y-3">
        {orders?.map(order => (
          <OrderCard key={order.id} order={order} showCustomer
            actions={<StatusActions order={order} onChanged={() => setVersion(v => v + 1)} />} />
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-[#4F4F4F]/70">{label}</p>
      <p className="text-xl font-bold text-[#19766D]">{value}</p>
    </div>
  );
}

function StatusActions({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = nextStatus(order);

  const change = async (status: OrderStatus) => {
    if (status === 'Cancelled' && !window.confirm(`Cancelar o pedido #${order.id}?`)) return;
    setBusy(true);
    setError(null);
    try {
      await updateOrderStatus(order.id, status);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível alterar o status.'));
      // a 409 usually means the order changed meanwhile
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  if (!next && !restaurantCanCancel(order)) return null;

  return (
    <>
      {next && (
        <button className={primaryButton} disabled={busy} onClick={() => change(next)}>{advanceLabels[next]}</button>
      )}
      {restaurantCanCancel(order) && (
        <button className="text-sm font-medium text-red-500 hover:underline disabled:opacity-50" disabled={busy}
          onClick={() => change('Cancelled')}>
          Cancelar pedido
        </button>
      )}
      {error && <p className="text-sm text-red-500 w-full">{error}</p>}
    </>
  );
}
