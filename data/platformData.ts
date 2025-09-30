import { Restaurant, PlatformAdmin } from '../types';

export const initialRestaurants: Restaurant[] = [
  {
    id: 'blink-restaurant',
    name: 'Blink Restaurant (Demo)',
    owner: 'John Doe',
    status: 'active',
    joinDate: '2023-10-26',
    credits: 100, // Initial free credits for trial
    isGameActive: true,
    isCustomerClubActive: true,
  },
  {
    id: 'pizza-palace',
    name: 'Pizza Palace',
    owner: 'Jane Smith',
    status: 'active',
    joinDate: '2023-11-15',
    credits: 0,
    isGameActive: false,
    isCustomerClubActive: false,
  },
  {
    id: 'sushi-central',
    name: 'Sushi Central',
    owner: 'Kenji Tanaka',
    status: 'inactive',
    joinDate: '2024-01-20',
    credits: 0,
    isGameActive: false,
    isCustomerClubActive: false,
  },
];

export const initialPlatformAdmins: PlatformAdmin[] = [
    {
        id: 'admin-001',
        email: 'admin@blink.com',
        role: 'Super Admin',
    }
];