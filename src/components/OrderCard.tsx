import type { Order } from '../types/api';
import { formatCurrency } from '../lib/format';
import { fulfillmentLabels, orderStatusLabels, paymentLabels } from '../lib/labels';

interface OrderCardProps {
  order: Order;
  // Heading shown above the order id (restaurant name for customers).
  title?: string;
  // Restaurant view: show who ordered.
  showCustomer?: boolean;
}

export function OrderCard({ order, title, showCustomer }: OrderCardProps) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      <div className="flex justify-between items-start mb-2 gap-3">
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <p className="text-xs text-[#4F4F4F]/70">
            Pedido #{order.id} • {new Date(order.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-[#19766D]/10 text-[#19766D] shrink-0">
          {orderStatusLabels[order.status]}
        </span>
      </div>

      {showCustomer && (
        <p className="text-sm mb-2">
          <span className="font-medium">{order.customerName}</span> • {order.customerPhone}
          {order.customerId === null && <span className="text-xs text-[#4F4F4F]/70"> (sem conta)</span>}
        </p>
      )}

      <ul className="text-sm space-y-0.5 mb-2">
        {order.items.map(item => (
          <li key={item.productId}>{item.quantity}x {item.productName}</li>
        ))}
      </ul>

      <p className="text-xs text-[#4F4F4F]/70">
        {fulfillmentLabels[order.fulfillmentType]}
        {order.deliveryAddress && `: ${order.deliveryAddress}`} • {paymentLabels[order.paymentMethod]}
      </p>

      <div className="flex justify-between text-sm font-semibold border-t mt-3 pt-2">
        <span>
          Total{order.fulfillmentType === 'Delivery' && ` (entrega ${formatCurrency(order.deliveryFee)})`}
        </span>
        <span>{formatCurrency(order.total)}</span>
      </div>
    </div>
  );
}
