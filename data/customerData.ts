import { Customer } from '../types';

export const initialCustomers: Customer[] = [
  {
    id: '09123456789',
    name: 'سارا رضایی',
    phone: '09123456789',
    joinDate: '2024-05-20',
    gameProgress: {
      level: 5,
      totalScore: 5250,
      highScore: 850,
    },
    orderHistory: [],
    restaurantId: 'blink-restaurant',
  },
  {
    id: '09121112233',
    name: 'علی احمدی',
    phone: '09121112233',
    joinDate: '2024-05-21',
    gameProgress: {
      level: 4,
      totalScore: 3100,
      highScore: 620,
    },
    orderHistory: [],
    restaurantId: 'blink-restaurant',
  },
  {
    id: '09129876543',
    name: 'John Doe',
    phone: '09129876543',
    joinDate: '2024-05-22',
    gameProgress: {
      level: 6,
      totalScore: 8900,
      highScore: 1200,
    },
    orderHistory: [],
    restaurantId: 'blink-restaurant',
  },
   {
    id: '09351234567',
    name: 'مریم محمدی',
    phone: '09351234567',
    joinDate: '2024-05-23',
    gameProgress: {
      level: 2,
      totalScore: 800,
      highScore: 300,
    },
    orderHistory: [],
    restaurantId: 'blink-restaurant',
  },
];
