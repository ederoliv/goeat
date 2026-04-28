export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  products: Product[];
}

export const menuData: MenuCategory[] = [
  {
    id: "bebidas",
    title: "Bebidas",
    products: [
      { id: "b1", name: "Coca Cola 2L", description: "Refrigerante Coca-Cola sabor original.", price: "R$ 14,00", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&h=150&fit=crop" },
      { id: "b2", name: "Suco Natural de Laranja 500ml", description: "Feito na hora, sem açúcar adicional.", price: "R$ 10,00", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150&h=150&fit=crop" }
    ]
  },
  {
    id: "xis",
    title: "Xis",
    products: [
      { id: "x1", name: "Xis Salada", description: "Pão, maionese, carne, queijo, alface, tomate, milho, ervilha e ovo.", price: "R$ 25,00", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop" },
      { id: "x2", name: "Xis Bacon", description: "Pão, maionese, carne, muito bacon, queijo, alface e ovo.", price: "R$ 30,00", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=150&h=150&fit=crop" },
      { id: "x3", name: "Xis Tudo", description: "Pão, maionese, carne, frango, coração, bacon, calabresa, queijo... o verdadeiro exagero.", price: "R$ 38,00", image: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=150&h=150&fit=crop" }
    ]
  },
  {
    id: "entradas",
    title: "Entradas",
    products: [
      { id: "e1", name: "Porção de Fritas (Média)", description: "Batatas fritas crocantes com sal e orégano. Acompanha molho da casa.", price: "R$ 22,00", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=150&h=150&fit=crop" },
      { id: "e2", name: "Anéis de Cebola (Onion Rings)", description: "Porção com deliciosos anéis de cebola empanados.", price: "R$ 20,00", image: "https://images.unsplash.com/photo-1639024470081-30d075ebf17d?w=150&h=150&fit=crop" }
    ]
  }
];
