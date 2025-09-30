// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                o.id, o.table_number, o.total, o.status, o.timestamp, o.restaurant_id,
                json_agg(json_build_object(
                    'id', mi.id,
                    'name_en', mi.name_en,
                    'name_fa', mi.name_fa,
                    'quantity', oi.quantity,
                    'price', oi.price_at_order,
                    'imageUrl', mi.image_url
                )) as items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            GROUP BY o.id
            ORDER BY o.timestamp DESC
        `);

        // Transform to match frontend's expected structure
        const formattedOrders = rows.map(order => ({
            id: order.id.toString(),
            tableNumber: order.table_number,
            total: order.total,
            status: order.status,
            timestamp: new Date(order.timestamp),
            restaurantId: order.restaurant_id,
            items: order.items.map(item => ({
                id: item.id,
                name: { en: item.name_en, fa: item.name_fa },
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl,
                 // Add other necessary fields from menu_items if needed, or keep it lean
            }))
        }));

        res.json(formattedOrders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error while fetching orders');
    }
});


// POST a new order
router.post('/', async (req, res) => {
    const { tableNumber, total, items, restaurantId, customerId } = req.body; // Added customerId

    if (!tableNumber || !items || items.length === 0) {
        return res.status(400).json({ msg: 'Please provide table number and items' });
    }

    try {
        // Start transaction
        await db.query('BEGIN');

        // Insert into orders table
        const orderQuery = 'INSERT INTO orders (table_number, total, restaurant_id, customer_id) VALUES ($1, $2, $3, $4) RETURNING id';
        const orderResult = await db.query(orderQuery, [tableNumber, total, restaurantId, customerId]); // Pass customerId
        const orderId = orderResult.rows[0].id;

        // Insert into order_items table
        const itemInsertPromises = items.map(item => {
            const itemQuery = 'INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order) VALUES ($1, $2, $3, $4)';
            return db.query(itemQuery, [orderId, item.id, item.quantity, item.price]);
        });
        await Promise.all(itemInsertPromises);
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.status(201).json({ msg: 'Order created', orderId });

    } catch (err) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['New', 'In Progress', 'Completed'];

    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        const { rows } = await db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
