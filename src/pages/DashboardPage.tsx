import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ClipboardList, LogOut, Store, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrdersTab } from '../components/dashboard/OrdersTab';
import { MenuTab } from '../components/dashboard/MenuTab';
import { ProfileTab } from '../components/dashboard/ProfileTab';

type Tab = 'orders' | 'menu' | 'profile';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'orders', label: 'Pedidos', icon: ClipboardList },
  { id: 'menu', label: 'Cardápio', icon: UtensilsCrossed },
  { id: 'profile', label: 'Perfil', icon: Store },
];

export function DashboardPage() {
  const { restaurant, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('orders');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#4F4F4F]">Carregando...</div>;
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#4F4F4F]">
        <p>Esta área é exclusiva para restaurantes.</p>
        <Link to="/restaurant/login" className="font-bold text-[#19766D] hover:underline">Entrar como restaurante</Link>
      </div>
    );
  }

  const handleLogout = async () => {
    logout();
    await navigate({ to: '/restaurant/login' });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#4F4F4F]">
      <header className="bg-[#19766D] text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/70">Painel do restaurante</p>
            <h1 className="text-xl font-bold">{restaurant.name}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-2 py-1 rounded-md font-medium ${restaurant.isOpen ? 'bg-[#A1EE30] text-[#19766D]' : 'bg-white/20'}`}>
              {restaurant.isOpen ? 'Aberto' : 'Fechado'}
            </span>
            <Link to="/menu/$restaurantId" params={{ restaurantId: String(restaurant.id) }} className="hover:underline hidden sm:inline">
              Ver página pública
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:underline">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-6 flex gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === id ? 'bg-[#F7F7F8] text-[#19766D]' : 'text-white/80 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        {!restaurant.isOpen && (
          <p className="mb-4 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-4 py-3">
            Seu restaurante está fechado e não recebe pedidos. Monte o cardápio e abra a loja na aba Perfil.
          </p>
        )}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'menu' && <MenuTab restaurantId={restaurant.id} />}
        {tab === 'profile' && <ProfileTab restaurant={restaurant} />}
      </main>
    </div>
  );
}
