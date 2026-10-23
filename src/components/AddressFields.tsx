import { useRef, useState } from 'react';
import { inputClass } from './dashboard/styles';
import type { AddressValues } from '../lib/address';
import { lookupCep } from '../services/viacep';

type CepStatus = 'idle' | 'loading' | 'found' | 'notFound' | 'unavailable';

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

// The CEP comes first: ViaCEP fills street, neighborhood, city and state so names are standardized.
// City and state are read-only unless ViaCEP is unreachable, so the user is never blocked.
export function AddressFields({ values, onChange }: { values: AddressValues; onChange: (values: AddressValues) => void }) {
  const [cepStatus, setCepStatus] = useState<CepStatus>(values.city ? 'found' : 'idle');
  const lastLookup = useRef('');

  const set = (key: keyof AddressValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...values, [key]: e.target.value });

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = formatCep(e.target.value);
    const digits = zipCode.replace(/\D/g, '');
    lastLookup.current = digits;

    if (digits.length < 8) {
      // A partial CEP invalidates the city/state obtained from the previous one.
      setCepStatus('idle');
      onChange({ ...values, zipCode, city: '', state: '' });
      return;
    }

    onChange({ ...values, zipCode });
    setCepStatus('loading');
    try {
      const info = await lookupCep(digits);
      if (lastLookup.current !== digits) return; // a newer CEP was typed meanwhile
      if (!info) {
        setCepStatus('notFound');
        onChange({ ...values, zipCode, city: '', state: '' });
        return;
      }
      setCepStatus('found');
      onChange({
        ...values,
        zipCode,
        street: info.street || values.street,
        neighborhood: info.neighborhood || values.neighborhood,
        city: info.city,
        state: info.state,
      });
    } catch {
      if (lastLookup.current === digits) setCepStatus('unavailable');
    }
  };

  const manual = cepStatus === 'unavailable';

  return (
    <div className="space-y-3">
      <Field label="CEP" className="max-w-[180px]">
        <input className={inputClass} value={values.zipCode} onChange={handleCepChange} required inputMode="numeric"
          placeholder="00000-000" minLength={8} maxLength={9} />
      </Field>
      {cepStatus === 'loading' && <p className="text-xs text-[#4F4F4F]/70">Buscando CEP...</p>}
      {cepStatus === 'notFound' && <p className="text-xs text-red-500">CEP não encontrado. Confira o número digitado.</p>}
      {manual && (
        <p className="text-xs text-amber-600">Não foi possível consultar o CEP agora. Preencha cidade e UF manualmente.</p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Field label="Rua" className="col-span-2">
          <input className={inputClass} value={values.street} onChange={set('street')} required minLength={2} maxLength={150} />
        </Field>
        <Field label="Número">
          <input className={inputClass} value={values.number} onChange={set('number')} required maxLength={20} />
        </Field>
      </div>
      <Field label="Complemento (opcional)">
        <input className={inputClass} value={values.complement} onChange={set('complement')} maxLength={100} />
      </Field>
      <Field label="Bairro">
        <input className={inputClass} value={values.neighborhood} onChange={set('neighborhood')} required minLength={2} maxLength={100} />
      </Field>
      <div className="grid grid-cols-4 gap-3">
        <Field label="Cidade" className="col-span-3">
          <input className={`${inputClass} ${manual ? '' : 'bg-gray-50 text-[#4F4F4F]/80'}`} value={values.city}
            onChange={set('city')} readOnly={!manual} required minLength={2} maxLength={100}
            placeholder={manual ? '' : 'Preenchida pelo CEP'} />
        </Field>
        <Field label="UF">
          <input className={`${inputClass} ${manual ? '' : 'bg-gray-50 text-[#4F4F4F]/80'}`} value={values.state}
            onChange={set('state')} readOnly={!manual} required minLength={2} maxLength={2} />
        </Field>
      </div>
    </div>
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
