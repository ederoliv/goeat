export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNumber: number;
  image?: string;
  options?: ProductOption[];
}

export interface MenuCategory {
  id: string;
  title: string;
  products: Product[];
}

const defaultOptions: ProductOption[] = [
  { id: "opt1", name: "Batata-palha", price: 1.50 },
  { id: "opt2", name: "Catupiry", price: 1.50 },
  { id: "opt3", name: "Cheddar", price: 1.50 },
  { id: "opt4", name: "Ovo extra", price: 2.00 },
  { id: "opt5", name: "Bacon extra", price: 3.50 }
];

export const menuData: MenuCategory[] = [
  {
    id: "bebidas",
    title: "Bebidas",
    products: [
      { id: "b1", name: "Coca Cola 2L", description: "Refrigerante Coca-Cola sabor original.", price: "R$ 14,00", priceNumber: 14.00, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&h=150&fit=crop" },
      { id: "b2", name: "Suco Natural de Laranja 500ml", description: "Feito na hora, sem açúcar adicional.", price: "R$ 10,00", priceNumber: 10.00, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150&h=150&fit=crop" }
    ]
  },
  {
    id: "xis",
    title: "Xis",
    products: [
      { id: "x1", name: "Xis Salada", description: "Pão, maionese, carne, queijo, alface, tomate, milho, ervilha e ovo.", price: "R$ 25,00", priceNumber: 25.00, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop", options: defaultOptions },
      { id: "x2", name: "Xis Bacon", description: "Pão, maionese, carne, muito bacon, queijo, alface e ovo.", price: "R$ 30,00", priceNumber: 30.00, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=150&h=150&fit=crop", options: defaultOptions },
      { id: "x3", name: "Xis Tudo", description: "Pão, maionese, carne, frango, coração, bacon, calabresa, queijo... o verdadeiro exagero.", price: "R$ 38,00", priceNumber: 38.00, image: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=150&h=150&fit=crop", options: defaultOptions }
    ]
  },
  {
    id: "entradas",
    title: "Entradas",
    products: [
      { id: "e1", name: "Porção de Fritas (Média)", description: "Batatas fritas crocantes com sal e orégano. Acompanha molho da casa.", price: "R$ 22,00", priceNumber: 22.00, image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=150&h=150&fit=crop" },
      { id: "e2", name: "Anéis de Cebola (Onion Rings)", description: "Porção com deliciosos anéis de cebola empanados.", price: "R$ 20,00", priceNumber: 20.00, image: "https://images.unsplash.com/photo-1639024470081-30d075ebf17d?w=150&h=150&fit=crop" }
    ]
  }
];
