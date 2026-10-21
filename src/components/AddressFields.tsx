import { inputClass } from './dashboard/styles';
import type { AddressValues } from '../lib/address';

export function AddressFields({ values, onChange }: { values: AddressValues; onChange: (values: AddressValues) => void }) {
  const set = (key: keyof AddressValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...values, [key]: e.target.value });

  return (
    <div className="space-y-3">
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
      <div className="grid grid-cols-6 gap-3">
        <Field label="Cidade" className="col-span-3">
          <input className={inputClass} value={values.city} onChange={set('city')} required minLength={2} maxLength={100} />
        </Field>
        <Field label="UF" className="col-span-1">
          <input className={inputClass} value={values.state} onChange={set('state')} required minLength={2} maxLength={2} />
        </Field>
        <Field label="CEP" className="col-span-2">
          <input className={inputClass} value={values.zipCode} onChange={set('zipCode')} required minLength={8} maxLength={10} />
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
