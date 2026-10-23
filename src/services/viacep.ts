// ViaCEP (https://viacep.com.br), external service used to standardize street, city and state names.

export interface CepInfo {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface ViaCepResponse {
  erro?: boolean | string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

// Returns null when the CEP does not exist; throws when ViaCEP cannot be reached.
export async function lookupCep(cep: string): Promise<CepInfo | null> {
  const digits = cep.replace(/\D/g, '');
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!res.ok) {
    // ViaCEP answers 400 for a malformed CEP; anything else is an outage.
    if (res.status === 400) return null;
    throw new Error(`ViaCEP respondeu ${res.status}`);
  }
  const data: ViaCepResponse = await res.json();
  if (data.erro || !data.localidade || !data.uf) return null;
  return {
    street: data.logradouro ?? '',
    neighborhood: data.bairro ?? '',
    city: data.localidade,
    state: data.uf.toUpperCase(),
  };
}
