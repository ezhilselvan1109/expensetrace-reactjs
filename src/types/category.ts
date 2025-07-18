export interface Category {
  id: string;
  name: string;
  type: number; // 1 = Expense, 2 = Income
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  type: number;
  color: string;
  icon: string;
}

export interface UpdateCategoryData {
  name?: string;
  type?: number;
  color?: string;
  icon?: string;
}

export const CATEGORY_COLORS = [
  'red', 'blue', 'brown', 'green', 'cream', 'yellow', 'orange', 'aqua', 
  'indigo', 'maroon', 'teal', 'turquoise', 'burgundy', 'aubergine', 'beige'
] as const;

export type CategoryColor = typeof CATEGORY_COLORS[number];

export const CATEGORY_ICONS = {
  'Food': [
    'apple', 'banana', 'carrot', 'corn', 'lemon', 'orange', 'potato', 'strawberry',
    'bacon', 'egg', 'fish', 'hamburger', 'sausage', 'bread', 'cookie', 'croissant',
    'donut', 'pie', 'cheese', 'milk', 'ice-cream', 'coffee', 'wine-glass', 'salad', 'sandwich'
  ],
  'Travel': [
    'airplane', 'bus', 'car', 'train', 'taxi', 'boat', 'motorcycle', 'hotel',
    'bed', 'key', 'hiking', 'camping', 'museum', 'park', 'mountain', 'compass',
    'map', 'passport', 'ticket', 'suitcase', 'backpack'
  ],
  'Shopping': [
    'shopping-bag', 'shopping-basket', 'cart-arrow-down', 'cart-plus', 'credit-card',
    'money-bill', 'money-check-alt', 'barcode', 'qrcode'
  ]
} as const;