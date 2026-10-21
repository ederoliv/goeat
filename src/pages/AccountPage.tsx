import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { MapPin, Star } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Avatar } from '../components/Avatar';
import { AddressFields } from '../components/AddressFields';
import { emptyAddress, formatAddress, toAddressRequest, toAddressValues } from '../lib/address';
import type { AddressValues } from '../lib/address';
import { inputClass, primaryButton, secondaryButton } from '../components/dashboard/styles';
import { useAuth } from '../context/AuthContext';
import { useRequest } from '../hooks/useRequest';
import * as authService from '../services/auth';
import { getErrorMessage } from '../lib/errors';
import type { Customer, CustomerAddress } from '../types/api';

interface Message { text: string; ok: boolean }

export function AccountPage() {
  const { customer, loading, setCustomer } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#4F4F4F]">
      <nav className="bg-[#19766D] text-white py-3 px-6">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Link to="/"><img src="/assets/icon.svg" alt="GoEat" className="h-8" /></Link>
          <Link to="/orders" className="text-sm font-medium hover:underline">Meus pedidos</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        <h1 className="text-2xl font-bold">Minha conta</h1>

        {loading && <p className="text-[#4F4F4F]/70">Carregando...</p>}
        {!loading && !customer && (
          <p>
            <Link to="/login" className="font-bold text-[#19766D] hover:underline">Entre</Link> para acessar sua conta.
          </p>
        )}
        {customer && (
          <>
            <ProfileSection customer={customer} onSaved={setCustomer} />
            <AddressesSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProfileSection({ customer, onSaved }: { customer: Customer; onSaved: (customer: Customer) => void }) {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [profileImageUrl, setProfileImageUrl] = useState(customer.profileImageUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      // omitting the image clears it
      onSaved(await authService.updateMe({ name, phone, profileImageUrl: profileImageUrl.trim() || undefined }));
      setMessage({ text: 'Perfil salvo.', ok: true });
    } catch (err) {
      setMessage({ text: getErrorMessage(err, 'Não foi possível salvar.'), ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-100 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold">Perfil</h2>
      <div className="flex items-center gap-4">
        <Avatar name={name || customer.name} imageUrl={profileImageUrl.trim()}
          className="w-16 h-16 rounded-full bg-[#A1EE30] text-[#19766D] text-2xl shrink-0" />
        <Field label="Link da imagem de perfil" className="flex-1">
          <input className={inputClass} type="url" maxLength={500} placeholder="https://..." value={profileImageUrl}
            onChange={e => setProfileImageUrl(e.target.value)} />
        </Field>
      </div>
      <Field label="Nome">
        <input className={inputClass} value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={150} />
      </Field>
      <Field label="Telefone">
        <input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} required minLength={8} maxLength={30} />
      </Field>
      <Field label="E-mail (não pode ser alterado)">
        <input className={inputClass} value={customer.email} disabled />
      </Field>
      {message && <p className={`text-sm ${message.ok ? 'text-[#19766D]' : 'text-red-500'}`}>{message.text}</p>}
      <button type="submit" disabled={saving} className={primaryButton}>{saving ? 'Salvando...' : 'Salvar'}</button>
    </form>
  );
}

// `editing`: null = form closed, 'new' = creating, otherwise the address being edited.
type Editing = 'new' | CustomerAddress | null;

function AddressesSection() {
  const [reload, setReload] = useState(0);
  const { data: addresses, loading, error } = useRequest(() => authService.getAddresses(), [reload]);
  const [editing, setEditing] = useState<Editing>(null);
  const [message, setMessage] = useState<Message | null>(null);

  const refresh = () => setReload(n => n + 1);

  const run = async (action: () => Promise<unknown>, fallback: string) => {
    setMessage(null);
    try {
      await action();
      refresh();
    } catch (err) {
      setMessage({ text: getErrorMessage(err, fallback), ok: false });
    }
  };

  const makePrimary = (a: CustomerAddress) =>
    run(() => authService.updateAddress(a.id, { ...toAddressRequest(toAddressValues(a)), label: a.label, isPrimary: true }),
      'Não foi possível definir o endereço principal.');

  const remove = (a: CustomerAddress) => {
    if (!window.confirm(`Excluir o endereço "${a.label}"?`)) return;
    void run(() => authService.deleteAddress(a.id), 'Não foi possível excluir o endereço.');
  };

  return (
    <section className="border border-gray-100 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Meus endereços</h2>
        {editing === null && (
          <button className={primaryButton} onClick={() => setEditing('new')}>Novo endereço</button>
        )}
      </div>

      {loading && <p className="text-sm text-[#4F4F4F]/70">Carregando...</p>}
      {!!error && <p className="text-sm text-red-500">Não foi possível carregar os endereços.</p>}
      {message && <p className={`text-sm ${message.ok ? 'text-[#19766D]' : 'text-red-500'}`}>{message.text}</p>}
      {!loading && !error && addresses?.length === 0 && editing === null && (
        <p className="text-sm text-[#4F4F4F]/70">Você ainda não cadastrou endereços.</p>
      )}

      <ul className="space-y-3">
        {addresses?.map(a => (
          <li key={a.id} className="rounded-lg bg-[#F7F7F8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#19766D]" /> {a.label}
                {a.isPrimary && (
                  <span className="flex items-center gap-1 text-xs bg-[#A1EE30] text-[#19766D] rounded-md px-2 py-0.5 font-bold">
                    <Star className="w-3 h-3 fill-current" /> Principal
                  </span>
                )}
              </p>
              <p className="text-sm text-[#4F4F4F]/80">{formatAddress(a)}</p>
            </div>
            <div className="flex gap-3 text-sm font-medium shrink-0">
              {!a.isPrimary && (
                <button className="text-[#19766D] hover:underline" onClick={() => makePrimary(a)}>Tornar principal</button>
              )}
              <button className="text-[#19766D] hover:underline" onClick={() => setEditing(a)}>Editar</button>
              <button className="text-red-500 hover:underline" onClick={() => remove(a)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>

      {editing !== null && (
        <AddressForm
          key={editing === 'new' ? 'new' : editing.id}
          address={editing === 'new' ? null : editing}
          isFirst={(addresses?.length ?? 0) === 0}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh(); }}
        />
      )}
    </section>
  );
}

interface AddressFormProps {
  address: CustomerAddress | null;
  isFirst: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

function AddressForm({ address, isFirst, onCancel, onSaved }: AddressFormProps) {
  const [label, setLabel] = useState(address?.label ?? '');
  const [values, setValues] = useState<AddressValues>(address ? toAddressValues(address) : emptyAddress);
  const [isPrimary, setIsPrimary] = useState(address?.isPrimary ?? isFirst);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = { ...toAddressRequest(values), label: label.trim(), isPrimary };
    try {
      if (address) await authService.updateAddress(address.id, body);
      else await authService.createAddress(body);
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível salvar o endereço.'));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 space-y-3">
      <h3 className="font-medium">{address ? 'Editar endereço' : 'Novo endereço'}</h3>
      <Field label="Nome do endereço (ex.: Casa, Trabalho)">
        <input className={inputClass} value={label} onChange={e => setLabel(e.target.value)} required maxLength={50} />
      </Field>
      <AddressFields values={values} onChange={setValues} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="w-4 h-4 accent-[#19766D]" checked={isPrimary}
          disabled={isFirst || address?.isPrimary} onChange={e => setIsPrimary(e.target.checked)} />
        Endereço principal
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>{saving ? 'Salvando...' : 'Salvar'}</button>
        <button type="button" className={secondaryButton} onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      <span className="text-xs text-[#4F4F4F]/80">{label}</span>
      {children}
    </label>
  );
}
