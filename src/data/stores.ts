export interface Promo {
  type: 'present' | 'coupon' | 'free_delivery';
  text: string;
}

export interface StoreAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipCode: string;
}

export interface StoreCity {
  name: string;
  stateCode: string;
  slug: string;
}

export interface Store {
  publicId: string;
  slug: string;
  name: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE';
  address?: StoreAddress;
  city?: StoreCity;
  phone?: string;
  
  // UI Display fields (often coming from search index or calculated)
  rating: number;
  category: string;
  distance: string;
  time: string;
  fee: string;
  promo?: Promo;
  logoUrl: string;
  isSuper?: boolean;
}

export const stores: Store[] = [
  { 
    publicId: "d290f1ee-6c54-4b01-90e6-d701748f0851", 
    slug: "menu-lanches", 
    name: "Menu Lanches", 
    status: "ACTIVE",
    rating: 4.6, 
    category: "Lanches", 
    distance: "10.5 km", 
    time: "70-80 min", 
    fee: "R$ 15,00", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "f47ac10b-58cc-4372-a567-0e02b2c3d479", 
    slug: "pizzaria-belsabore", 
    name: "Pizzaria Belsabore", 
    status: "ACTIVE",
    rating: 4.6, 
    category: "Pizza", 
    distance: "7.2 km", 
    time: "40-50 min", 
    fee: "Grátis", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "e9b11d9f-1414-46c5-8f6f-2b581b2a952a", 
    slug: "dona-iza-acai", 
    name: "Dona Iza Açaí", 
    status: "ACTIVE",
    rating: 4.8, 
    category: "Açaí", 
    distance: "8.1 km", 
    time: "80-90 min", 
    fee: "R$ 20,00", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1553530666-ba11a7ddbbbd?w=150&h=150&fit=crop", 
    isSuper: true 
  },
  { 
    publicId: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", 
    slug: "takai-sushi", 
    name: "Takai Sushi", 
    status: "ACTIVE",
    rating: 4.6, 
    category: "Japonesa", 
    distance: "8.1 km", 
    time: "90-100 min", 
    fee: "R$ 20,00", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "c2d29867-3d0b-4497-915e-18d5b12a8569", 
    slug: "dark-side-frango-frito", 
    name: "Dark Side - Frango Frito", 
    status: "ACTIVE",
    rating: 4.3, 
    category: "Lanches", 
    distance: "8.1 km", 
    time: "60-70 min", 
    fee: "R$ 24,00", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "a3a8e9e1-2309-417c-a496-ec619d80d24f", 
    slug: "la-bella-delivery", 
    name: "La Bella Delivery", 
    status: "ACTIVE",
    rating: 4.6, 
    category: "Pizza", 
    distance: "6.8 km", 
    time: "40-50 min", 
    fee: "Grátis", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "7f4c5e80-87a3-4f24-9b2d-106b83f08149", 
    slug: "dona-iza-doceria", 
    name: "Dona Iza Doceria", 
    status: "ACTIVE",
    rating: 4.8, 
    category: "Doces & Bolos", 
    distance: "7.5 km", 
    time: "50-60 min", 
    fee: "R$ 15,00", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1481391319762-47dcb7295f71?w=150&h=150&fit=crop", 
    isSuper: true 
  },
  { 
    publicId: "bb562095-2c26-4448-b4b1-a6e5b225916d", 
    slug: "pizzaria-cattani", 
    name: "Pizzaria Cattani", 
    status: "ACTIVE",
    rating: 4.7, 
    category: "Pizza", 
    distance: "6.9 km", 
    time: "40-50 min", 
    fee: "Grátis", 
    promo: { type: 'present', text: 'Presente até R$ 10' }, 
    logoUrl: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "d6b5e5a2-9b2f-4e08-96f3-18d9f10f443b", 
    slug: "pizzaria-do-vava", 
    name: "Pizzaria do Vava", 
    status: "ACTIVE",
    rating: 4.7, 
    category: "Pizza", 
    distance: "6.9 km", 
    time: "40-50 min", 
    fee: "Grátis", 
    promo: { type: 'coupon', text: 'Cupom de R$ 5 disponível' }, 
    logoUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "f0a8d6e9-0b1a-42cd-91a5-83e8b4e857c2", 
    slug: "delicias-da-ro-doceria", 
    name: "Delícias da Rô - Doc...", 
    status: "ACTIVE",
    rating: 4.9, 
    category: "Doces & Bolos", 
    distance: "8.1 km", 
    time: "51-66 min", 
    fee: "R$ 20,99", 
    promo: { type: 'coupon', text: 'Cupom de R$ 5 disponível' }, 
    logoUrl: "https://images.unsplash.com/photo-1509482560494-4126f8225994?w=150&h=150&fit=crop", 
    isSuper: true 
  },
  { 
    publicId: "18b958c8-b2de-4e3a-96e0-9118e6988c5a", 
    slug: "psk-dogs", 
    name: "Psk Dogs", 
    status: "ACTIVE",
    rating: 4.2, 
    category: "Lanches", 
    distance: "8.8 km", 
    time: "37-52 min", 
    fee: "R$ 19,98", 
    logoUrl: "https://images.unsplash.com/photo-1616421575825-7832fb6d0d97?w=150&h=150&fit=crop" 
  },
  { 
    publicId: "4a8eb9b2-c6d9-485a-a5f1-332912448b3c", 
    slug: "coruja-rock-burguer", 
    name: "Coruja Rock Burguer...", 
    status: "ACTIVE",
    rating: 4.6, 
    category: "Lanches", 
    distance: "10.0 km", 
    time: "110-120 min", 
    fee: "R$ 24,00", 
    promo: { type: 'free_delivery', text: 'Entrega grátis a partir de R$ 75' }, 
    logoUrl: "https://images.unsplash.com/photo-1594212844574-e39cbcc757c2?w=150&h=150&fit=crop" 
  },
];
