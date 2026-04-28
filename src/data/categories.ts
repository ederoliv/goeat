import { Sandwich, Pizza, IceCream, Tag, UtensilsCrossed, Fish, Soup, Cake, Croissant } from 'lucide-react';

export interface Category {
  name: string;
  icon: React.ElementType;
}

export const categories: Category[] = [
  { name: "Lanches", icon: Sandwich },
  { name: "Pizza", icon: Pizza },
  { name: "Açaí", icon: IceCream },
  { name: "Promoções", icon: Tag },
  { name: "Brasileira", icon: UtensilsCrossed },
  { name: "Japonesa", icon: Fish },
  { name: "Árabe", icon: Soup },
  { name: "Doces & Bolos", icon: Cake },
  { name: "Pastel", icon: Croissant },
];
