import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateMyRestaurant } from '../../services/restaurants';
import { getErrorMessage } from '../../lib/errors';
import { inputClass, primaryButton } from './styles';
import type { RestaurantAccount } from '../../types/api';

export function ProfileTab({ restaurant }: { restaurant: RestaurantAccount }) {
  const { setRestaurant } = useAuth();
  const [name, setName] = useState(restaurant.name);
  const [cuisine, setCuisine] = useState(restaurant.cuisine);
  const [phone, setPhone] = useState(restaurant.phone ?? '');
  const [deliveryTimeMinutes, setDeliveryTimeMinutes] = useState(String(restaurant.deliveryTimeMinutes));
  const [deliveryFee, setDeliveryFee] = useState(String(restaurant.deliveryFee));
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateMyRestaurant({
        name, cuisine, phone, isOpen,
        deliveryTimeMinutes: Number(deliveryTimeMinutes),
        deliveryFee: Number(deliveryFee),
      });
      setRestaurant(updated);
      setMessage({ text: 'Perfil salvo.', ok: true });
    } catch (err) {
      setMessage({ text: getErrorMessage(err, 'Não foi possível salvar.'), ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 max-w-xl">
      <label className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F7F8] p-3 cursor-pointer">
        <span>
          <span className="font-semibold block">{isOpen ? 'Aberto para pedidos' : 'Fechado'}</span>
          <span className="text-xs text-[#4F4F4F]/70">Restaurantes fechados não recebem pedidos.</span>
        </span>
        <input type="checkbox" className="w-5 h-5 accent-[#19766D]" checked={isOpen} onChange={e => setIsOpen(e.target.checked)} />
      </label>

      <Field label="Nome">
        <input className={inputClass} value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={150} />
      </Field>
      <Field label="Culinária">
        <input className={inputClass} value={cuisine} onChange={e => setCuisine(e.target.value)} required minLength={2} maxLength={80} />
      </Field>
      <Field label="Telefone">
        <input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} required minLength={8} maxLength={30} />
      </Field>
      <Field label="E-mail (não pode ser alterado)">
        <input className={inputClass} value={restaurant.email ?? ''} disabled />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tempo de entrega (min)">
          <input className={inputClass} type="number" min={1} max={240} value={deliveryTimeMinutes}
            onChange={e => setDeliveryTimeMinutes(e.target.value)} required />
        </Field>
        <Field label="Taxa de entrega (R$)">
          <input className={inputClass} type="number" min={0} max={1000} step="0.01" value={deliveryFee}
            onChange={e => setDeliveryFee(e.target.value)} required />
        </Field>
      </div>

      {message && <p className={`text-sm ${message.ok ? 'text-[#19766D]' : 'text-red-500'}`}>{message.text}</p>}
      <button type="submit" disabled={saving} className={primaryButton}>{saving ? 'Salvando...' : 'Salvar'}</button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-[#4F4F4F]/80">{label}</span>
      {children}
    </label>
  );
}
