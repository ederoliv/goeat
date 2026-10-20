import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useRequest } from '../../hooks/useRequest';
import {
  createProduct, createSection, deleteProduct, deleteSection, getMenu, updateProduct, updateSection,
} from '../../services/restaurants';
import { getErrorMessage } from '../../lib/errors';
import { formatCurrency } from '../../lib/format';
import { inputClass, primaryButton, secondaryButton } from './styles';
import type { MenuSection, Product } from '../../types/api';

interface ProductForm {
  id?: number;
  menuSectionId: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
}

export function MenuTab({ restaurantId }: { restaurantId: number }) {
  const [version, setVersion] = useState(0);
  const { data: menu, loading, error } = useRequest(() => getMenu(restaurantId), [restaurantId, version]);
  const [sectionForm, setSectionForm] = useState<{ id?: number; name: string } | null>(null);
  const [productForm, setProductForm] = useState<ProductForm | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sections = [...(menu?.sections ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  // Runs a write, reloads the menu and surfaces the API's message when it fails.
  const run = async (action: () => Promise<unknown>, onDone?: () => void) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      onDone?.();
      setVersion(v => v + 1);
    } catch (e) {
      setMessage(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const submitSection = (e: FormEvent) => {
    e.preventDefault();
    if (!sectionForm) return;
    const body = { name: sectionForm.name.trim() };
    void run(
      () => (sectionForm.id ? updateSection(restaurantId, sectionForm.id, body) : createSection(restaurantId, body)),
      () => setSectionForm(null),
    );
  };

  const submitProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!productForm) return;
    const body = {
      menuSectionId: productForm.menuSectionId,
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price),
      imageUrl: productForm.imageUrl.trim() || null,
      isAvailable: productForm.isAvailable,
    };
    void run(
      () => (productForm.id ? updateProduct(restaurantId, productForm.id, body) : createProduct(restaurantId, body)),
      () => setProductForm(null),
    );
  };

  const newProduct = (section: MenuSection) =>
    setProductForm({ menuSectionId: section.id, name: '', description: '', price: '', imageUrl: '', isAvailable: true });

  const editProduct = (product: Product) =>
    setProductForm({
      id: product.id,
      menuSectionId: product.menuSectionId,
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl ?? '',
      isAvailable: product.isAvailable,
    });

  const toggleAvailability = (product: Product) =>
    run(() => updateProduct(restaurantId, product.id, {
      menuSectionId: product.menuSectionId,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isAvailable: !product.isAvailable,
    }));

  const removeProduct = (product: Product) => {
    if (window.confirm(`Excluir "${product.name}"?`)) void run(() => deleteProduct(restaurantId, product.id));
  };

  const removeSection = (section: MenuSection) => {
    if (window.confirm(`Excluir a seção "${section.name}"?`)) void run(() => deleteSection(restaurantId, section.id));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Cardápio</h2>
        <button className={`${primaryButton} flex items-center gap-2`} onClick={() => setSectionForm({ name: '' })}>
          <Plus className="w-4 h-4" /> Nova seção
        </button>
      </div>

      {message && <p className="text-sm text-red-500">{message}</p>}
      {loading && !menu && <p className="text-[#4F4F4F]/70">Carregando cardápio...</p>}
      {!!error && <p className="text-red-500">Não foi possível carregar o cardápio.</p>}
      {menu && sections.length === 0 && (
        <p className="text-[#4F4F4F]/70">Seu cardápio está vazio. Crie uma seção (ex.: Pratos, Bebidas) e adicione produtos.</p>
      )}

      {sectionForm && (
        <form onSubmit={submitSection} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 items-end">
          <label className="flex-1 space-y-1">
            <span className="text-xs text-[#4F4F4F]/80">Nome da seção</span>
            <input className={inputClass} value={sectionForm.name} required maxLength={80} autoFocus
              onChange={e => setSectionForm({ ...sectionForm, name: e.target.value })} />
          </label>
          <button type="submit" disabled={busy} className={primaryButton}>Salvar</button>
          <button type="button" className={secondaryButton} onClick={() => setSectionForm(null)}>Cancelar</button>
        </form>
      )}

      {productForm && (
        <form onSubmit={submitProduct} className="bg-white border border-[#19766D]/30 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold">{productForm.id ? 'Editar produto' : 'Novo produto'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-xs text-[#4F4F4F]/80">Nome</span>
              <input className={inputClass} value={productForm.name} required maxLength={150}
                onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[#4F4F4F]/80">Preço (R$)</span>
              <input className={inputClass} type="number" min={0.01} max={100000} step="0.01" value={productForm.price} required
                onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[#4F4F4F]/80">Seção</span>
              <select className={inputClass} value={productForm.menuSectionId}
                onChange={e => setProductForm({ ...productForm, menuSectionId: Number(e.target.value) })}>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[#4F4F4F]/80">URL da imagem (opcional)</span>
              <input className={inputClass} type="url" maxLength={500} value={productForm.imageUrl}
                onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs text-[#4F4F4F]/80">Descrição</span>
            <textarea className={inputClass} rows={2} maxLength={500} value={productForm.description} required
              onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-[#19766D]" checked={productForm.isAvailable}
              onChange={e => setProductForm({ ...productForm, isAvailable: e.target.checked })} />
            Disponível para pedido
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className={primaryButton}>Salvar</button>
            <button type="button" className={secondaryButton} onClick={() => setProductForm(null)}>Cancelar</button>
          </div>
        </form>
      )}

      {sections.map(section => (
        <div key={section.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
            <h3 className="font-semibold">{section.name}</h3>
            <div className="flex items-center gap-1">
              <button className={`${secondaryButton} flex items-center gap-1 h-8 px-3`} onClick={() => newProduct(section)}>
                <Plus className="w-4 h-4" /> Produto
              </button>
              <IconButton label="Renomear seção" onClick={() => setSectionForm({ id: section.id, name: section.name })}>
                <Pencil className="w-4 h-4" />
              </IconButton>
              <IconButton label="Excluir seção" onClick={() => removeSection(section)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </IconButton>
            </div>
          </div>

          {section.products.length === 0 && <p className="px-4 py-3 text-sm text-[#4F4F4F]/70">Sem produtos nesta seção.</p>}
          <ul className="divide-y">
            {section.products.map(product => (
              <li key={product.id} className="flex items-center gap-3 px-4 py-3">
                {product.imageUrl && <img src={product.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs text-[#4F4F4F]/70 truncate">{product.description}</p>
                </div>
                <span className="font-semibold text-[#19766D]">{formatCurrency(product.price)}</span>
                <button
                  disabled={busy}
                  onClick={() => toggleAvailability(product)}
                  className={`text-xs font-medium px-2 py-1 rounded-md ${product.isAvailable ? 'bg-[#19766D]/10 text-[#19766D]' : 'bg-red-50 text-red-600'}`}
                  title="Alternar disponibilidade"
                >
                  {product.isAvailable ? 'Disponível' : 'Esgotado'}
                </button>
                <IconButton label="Editar produto" onClick={() => editProduct(product)}>
                  <Pencil className="w-4 h-4" />
                </IconButton>
                <IconButton label="Excluir produto" onClick={() => removeProduct(product)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </IconButton>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
      {children}
    </button>
  );
}
