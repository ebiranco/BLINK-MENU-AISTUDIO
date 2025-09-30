import { Restaurant, Order, Transaction, PlatformAdmin } from '../types';
import { menuItems } from './menuData';

export const restaurants: Restaurant[] = [
    {
        id: 'blink-restaurant',
        name: 'رستوران بلینک',
        owner: 'تیم بلینک',
        status: 'active',
        joinDate: '2023-01-01',
        credits: 500,
        isGameActive: true,
        isCustomerClubActive: true,
    }
];

export const orders: Order[] = [
    {
        id: 'order1',
        items: [
            { ...menuItems[0], quantity: 1 }, // Caesar Salad
            { ...menuItems[2], quantity: 2 }, // Koobideh
        ],
        total: 150000 + (2 * 350000),
        tableNumber: '12',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        status: 'New',
        restaurantId: 'blink-restaurant',
    },
    {
        id: 'order2',
        items: [
            { ...menuItems[3], quantity: 1 }, // Pizza
        ],
        total: 280000,
        tableNumber: '5',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
        status: 'In Progress',
        restaurantId: 'blink-restaurant',
    },
    {
        id: 'order3',
        items: [
            { ...menuItems[4], quantity: 1 }, // Salmon
            { ...menuItems[6], quantity: 2 }, // Mojito
        ],
        total: 450000 + (2 * 130000),
        tableNumber: '8',
        timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
        status: 'Completed',
        restaurantId: 'blink-restaurant',
    },
];

export const transactions: Transaction[] = [
    { orderId: 'order1', amount: 850000, date: new Date(Date.now() - 30 * 60 * 1000), status: 'Success', restaurantId: 'blink-restaurant' },
    { orderId: 'order2', amount: 280000, date: new Date(Date.now() - 10 * 60 * 1000), status: 'Success', restaurantId: 'blink-restaurant' },
    { orderId: 'order3', amount: 710000, date: new Date(Date.now() - 120 * 60 * 1000), status: 'Success', restaurantId: 'blink-restaurant' },
];

export const admins: PlatformAdmin[] = [
    { id: 'admin-001', email: 'admin@blink.com', role: 'Super Admin' }
];
