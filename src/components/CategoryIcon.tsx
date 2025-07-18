import { Apple, Car, ShoppingBag, Banana, Bus, ShoppingBasket, Carrot, Plane, CreditCard, Coffee, Train, DollarSign, Fish, CarTaxiFront as Taxi, Receipt, Utensils, Hotel, QrCode, Heading as Bread, Bed, MapPin, Cookie, Key, Mountain, UserCheck as Cheese, Compass, Backpack, Wine, Briefcase as Suitcase, Map, Salad, Ticket, CookingPot as Hiking, Sandwich, Mouse as Museum, LampCeiling as Camping, Egg, Recycle as Motorcycle, Bot as Boat, Milk, Sparkle as Park, Import as Passport, DivideIcon as LucideIcon } from 'lucide-react';

// Icon mapping - using closest Lucide icons for the specified names
const iconMap: Record<string, LucideIcon> = {
  // Food icons
  'apple': Apple,
  'banana': Banana,
  'carrot': Carrot,
  'corn': Utensils, // Using utensils as placeholder
  'lemon': Apple, // Using apple as placeholder
  'orange': Apple, // Using apple as placeholder
  'potato': Carrot, // Using carrot as placeholder
  'strawberry': Apple, // Using apple as placeholder
  'bacon': Utensils,
  'egg': Egg,
  'fish': Fish,
  'hamburger': Utensils,
  'sausage': Utensils,
  'bread': Bread,
  'cookie': Cookie,
  'croissant': Bread,
  'donut': Cookie,
  'pie': Cookie,
  'cheese': Cheese,
  'milk': Milk,
  'ice-cream': Cookie,
  'coffee': Coffee,
  'wine-glass': Wine,
  'salad': Salad,
  'sandwich': Sandwich,

  // Travel icons
  'airplane': Plane,
  'bus': Bus,
  'car': Car,
  'train': Train,
  'taxi': Taxi,
  'boat': Boat,
  'motorcycle': Motorcycle,
  'hotel': Hotel,
  'bed': Bed,
  'key': Key,
  'hiking': Hiking,
  'camping': Camping,
  'museum': Museum,
  'park': Park,
  'mountain': Mountain,
  'compass': Compass,
  'map': Map,
  'passport': Passport,
  'ticket': Ticket,
  'suitcase': Suitcase,
  'backpack': Backpack,

  // Shopping icons
  'shopping-bag': ShoppingBag,
  'shopping-basket': ShoppingBasket,
  'cart-arrow-down': ShoppingBasket,
  'cart-plus': ShoppingBasket,
  'credit-card': CreditCard,
  'money-bill': DollarSign,
  'money-check-alt': Receipt,
  'barcode': Receipt,
  'qrcode': QrCode,
};

// Color mapping
const colorMap: Record<string, string> = {
  'red': 'bg-red-500',
  'blue': 'bg-blue-500',
  'brown': 'bg-amber-800',
  'green': 'bg-green-500',
  'cream': 'bg-yellow-100',
  'yellow': 'bg-yellow-500',
  'orange': 'bg-orange-500',
  'aqua': 'bg-cyan-500',
  'indigo': 'bg-indigo-500',
  'maroon': 'bg-red-800',
  'teal': 'bg-teal-500',
  'turquoise': 'bg-cyan-400',
  'burgundy': 'bg-red-900',
  'aubergine': 'bg-purple-800',
  'beige': 'bg-yellow-200',
};

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CategoryIcon({ icon, color, size = 'md', className = '' }: CategoryIconProps) {
  const IconComponent = iconMap[icon] || Utensils;
  const colorClass = colorMap[color] || 'bg-gray-500';
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`${colorClass} ${sizeClasses[size]} rounded-full flex items-center justify-center ${className}`}>
      <IconComponent className={`${iconSizes[size]} text-white`} />
    </div>
  );
}