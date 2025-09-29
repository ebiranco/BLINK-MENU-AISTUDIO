// FIX: Moved Language and TranslatableString definitions here and exported them to fix module resolution errors.
export type Language = 'en' | 'fa';

export interface TranslatableString {
  en: string;
  fa: string;
}

export interface MenuCategory {
  id: string;
  name: TranslatableString;
  imageUrl: string;
}

export interface MenuItem {
  id: number;
  name: TranslatableString;
  description: TranslatableString;
  price: number;
  prepTime: number; // in minutes
  imageUrl: string;
  allergens: TranslatableString[];
  isFavorite: boolean;
  categoryId: string; // Link to the category
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export type OrderStatus = 'New' | 'In Progress' | 'Completed';

export interface Order {
    id: string;
    tableNumber: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    timestamp: Date;
    isPaid: boolean; // Added to track payment status
}

export interface StylePreset {
  key: string;
  name: TranslatableString;
  previewImage: string;
  prompt: string;
  angle: string;
  lighting: string;
  background: string;
}

export interface GatewaySettings {
    apiKey: string;
    secretKey: string;
}

export interface Transaction {
    orderId: string;
    amount: number;
    date: Date;
    status: 'Paid';
}

export interface Reservation {
    id: string;
    name: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
}