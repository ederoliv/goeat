import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types/api';

export interface CartItem {
  id: string; // generated unique id
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface StoreInfo {
  id: string;
  name: string;
  deliveryFee: number;
  deliveryFeeText: string;
}

interface CartContextData {
  items: CartItem[];
  store: StoreInfo | null;
  addItem: (item: CartItem, storeInfo: StoreInfo) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (item: CartItem, storeInfo: StoreInfo) => {
    // Check if adding from a different store
    if (store && store.id !== storeInfo.id) {
      if (!window.confirm("Seu carrinho tem itens de outro restaurante. Deseja limpar o carrinho e começar um novo pedido?")) {
        return;
      }
      setItems([item]);
      setStore(storeInfo);
      setIsCartOpen(true);
      return;
    }

    setStore(storeInfo);
    // Merge with the existing line for the same product
    const existingItemIndex = items.findIndex(
      (i) => i.product.id === item.product.id
    );

    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += item.quantity;
      newItems[existingItemIndex].totalPrice += item.totalPrice;
      setItems(newItems);
    } else {
      setItems([...items, item]);
    }
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    if (newItems.length === 0) {
      setStore(null); // Clear store if cart becomes empty
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(items.map(item => {
      if (item.id === itemId) {
        const unitPrice = item.totalPrice / item.quantity;
        return { ...item, quantity, totalPrice: unitPrice * quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setStore(null);
  };

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal + (store?.deliveryFee || 0);

  return (
    <CartContext.Provider value={{ items, store, addItem, removeItem, updateQuantity, clearCart, subtotal, total, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
