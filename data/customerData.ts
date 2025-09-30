import { Customer } from '../types';

export const customers: Customer[] = [
  {
    id: '09121111111',
    name: 'سارا رضایی',
    phone: '09121111111',
    joinDate: '2023-10-26',
    gameProgress: {
        level: 5,
        totalScore: 4500,
        highScore: 850,
    },
    orderHistory: ['order1', 'order3'],
    restaurantId: 'blink-restaurant',
  },
  {
    id: '09122222222',
    name: 'علی احمدی',
    phone: '09122222222',
    joinDate: '2023-11-15',
    gameProgress: {
        level: 8,
        totalScore: 9800,
        highScore: 1200,
    },
    orderHistory: ['order2'],
    restaurantId: 'blink-restaurant',
  },
    {
    id: '09123333333',
    name: 'مریم محمدی',
    phone: '09123333333',
    joinDate: '2024-01-02',
    gameProgress: {
        level: 2,
        totalScore: 800,
        highScore: 350,
    },
    orderHistory: [],
    restaurantId: 'blink-restaurant',
  }
];
