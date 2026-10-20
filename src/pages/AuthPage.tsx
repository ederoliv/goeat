import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/errors';

interface AuthPageProps {
  mode: 'login' | 'register';
  account: 'customer' | 'restaurant';
}

const inputClass =
  'w-full border border-gray-200 rounded-lg py-2.5 px-3 text-[#4F4F4F] outline-none focus:border-[#19766D] focus:ring-1 focus:ring-[#19766D]';

export function AuthPage({ mode, account }: AuthPageProps) {
  const isRegister = mode === 'register';
  const isRestaurant = account === 'restaurant';
  const auth = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [deliveryTimeMinutes, setDeliveryTimeMinutes] = useState('40');
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const base = isRestaurant ? '/restaurant' : '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isRestaurant) {
        if (isRegister) {
          await auth.registerRestaurant({
            name, cuisine, email, phone, password,
            deliveryTimeMinutes: Number(deliveryTimeMinutes),
            deliveryFee: Number(deliveryFee),
          });
        } else {
          await auth.loginRestaurant({ email, password });
        }
        await navigate({ to: '/dashboard' });
      } else {
        if (isRegister) await auth.register({ name, email, phone, password });
        else await auth.login({ email, password });
        await navigate({ to: '/' });
      }
    } catch (err) {
      setError(getErrorMessage(err, isRegister ? 'Não foi possível criar a conta.' : 'E-mail ou senha incorretos.'));
    } finally {
      setSubmitting(false);
    }
  };

  const title = `${isRegister ? 'Criar conta' : 'Entrar'}${isRestaurant ? ' como restaurante' : ''}`;

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center px-4 py-8">
      <Link to="/" className="mb-6 bg-[#19766D] rounded-xl px-4 py-2">
        <img src="/assets/icon.svg" alt="GoEat" className="h-8" />
      </Link>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h1 className="text-xl font-bold text-[#4F4F4F]">{title}</h1>

        {isRegister && (
          <input className={inputClass} placeholder={isRestaurant ? 'Nome do restaurante' : 'Nome completo'} value={name}
            onChange={e => setName(e.target.value)} required minLength={2} maxLength={150} />
        )}
        {isRegister && isRestaurant && (
          <input className={inputClass} placeholder="Tipo de culinária (ex.: Pizza, Lanches)" value={cuisine}
            onChange={e => setCuisine(e.target.value)} required minLength={2} maxLength={80} />
        )}
        {isRegister && (
          <input className={inputClass} placeholder="Telefone" value={phone}
            onChange={e => setPhone(e.target.value)} required minLength={8} maxLength={30} />
        )}
        <input className={inputClass} type="email" placeholder="E-mail" value={email}
          onChange={e => setEmail(e.target.value)} required maxLength={254} />
        <input className={inputClass} type="password" placeholder="Senha" value={password}
          onChange={e => setPassword(e.target.value)} required minLength={isRegister ? 8 : 1} maxLength={100} />
        {isRegister && isRestaurant && (
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-[#4F4F4F]/80 space-y-1">
              Tempo de entrega (min)
              <input className={inputClass} type="number" min={1} max={240} value={deliveryTimeMinutes}
                onChange={e => setDeliveryTimeMinutes(e.target.value)} required />
            </label>
            <label className="text-xs text-[#4F4F4F]/80 space-y-1">
              Taxa de entrega (R$)
              <input className={inputClass} type="number" min={0} max={1000} step="0.01" value={deliveryFee}
                onChange={e => setDeliveryFee(e.target.value)} required />
            </label>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#19766D] hover:bg-[#135c55] disabled:opacity-50 text-white font-medium rounded-lg h-12 transition-colors"
        >
          {submitting ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}
        </button>

        <p className="text-sm text-center text-[#4F4F4F]/80">
          {isRegister ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
          <Link to={isRegister ? `${base}/login` : `${base}/register`} className="font-bold text-[#19766D] hover:underline">
            {isRegister ? 'Entrar' : 'Cadastre-se'}
          </Link>
        </p>
        <p className="text-xs text-center text-[#4F4F4F]/70 border-t pt-4">
          {isRestaurant ? 'É cliente?' : 'Tem um restaurante?'}{' '}
          <Link to={isRestaurant ? '/login' : '/restaurant/login'} className="font-bold text-[#19766D] hover:underline">
            {isRestaurant ? 'Acesse a área do cliente' : 'Acesse a área do restaurante'}
          </Link>
        </p>
      </form>
    </div>
  );
}
