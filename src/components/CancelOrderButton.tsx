import { useState } from 'react';
import { cancelOrder } from '../services/orders';
import { customerCanCancel } from '../lib/orderFlow';
import { getErrorMessage } from '../lib/errors';
import type { Order } from '../types/api';

// Customers can only cancel while the restaurant has not confirmed the order.
export function CancelOrderButton({ order, onCancelled }: { order: Order; onCancelled: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!customerCanCancel(order)) return null;

  const handleClick = async () => {
    if (!window.confirm('Cancelar este pedido?')) return;
    setBusy(true);
    setError(null);
    try {
      await cancelOrder(order.id);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível cancelar o pedido.'));
    } finally {
      setBusy(false);
      // on 409 the order was confirmed meanwhile: refresh either way
      onCancelled();
    }
  };

  return (
    <>
      <button className="text-sm font-medium text-red-500 hover:underline disabled:opacity-50" disabled={busy} onClick={handleClick}>
        Cancelar pedido
      </button>
      {error && <p className="text-sm text-red-500 w-full">{error}</p>}
    </>
  );
}
