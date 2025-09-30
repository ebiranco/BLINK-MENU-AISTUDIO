// FIX: Removed import of TranslatableString to break a circular dependency.
// The type is now defined directly in this file.
export type TranslatableString = {
  en: string;
  fa: string;
};

export type Language = 'en' | 'fa';

export interface MenuItem {
  id: number;
  name: TranslatableString;
  description: TranslatableString;
  price: number;
  prepTime: number;
  imageUrl: string;
  allergens: TranslatableString[];
  isFavorite: boolean;
  categoryId: string;
  restaurantId: string;
}

export interface MenuCategory {
  id: string;
  name: TranslatableString;
  imageUrl: string;
  restaurantId: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'New' | 'In Progress' | 'Completed';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  tableNumber: string;
  timestamp: Date;
  status: OrderStatus;
  restaurantId: string;
}

export interface User {
  id: string; // Typically owner ID
  name: string;
  restaurantId: string;
}

export interface Customer {
    id: string; // phone number
    name: string;
    phone: string;
    joinDate: string;
    gameProgress: {
        level: number;
        totalScore: number;
        highScore: number;
    };
    orderHistory: string[]; // array of order IDs
    restaurantId: string;
}

export interface GameInvite {
    from: Customer;
    to: Customer;
    status: 'pending' | 'accepted' | 'declined' | 'cancelled';
    game: 'EsmFamil';
    settings: {
        timer: number;
    };
}


export interface Transaction {
    orderId: string;
    amount: number;
    date: Date;
    status: 'Success' | 'Failed';
    restaurantId: string;
}

export interface GatewaySettings {
    apiKey: string;
    secretKey: string;
}

export interface Reservation {
    id: string;
    name: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
    restaurantId: string;
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

export interface Restaurant {
    id: string;
    name: string;
    owner: string;
    status: 'active' | 'inactive';
    joinDate: string;
    credits: number;
    isGameActive: boolean;
    isCustomerClubActive: boolean;
}

export interface PlatformAdmin {
    id: string;
    email: string;
    role: string;
}