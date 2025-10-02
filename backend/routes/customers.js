// backend/routes/customers.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

// Helper to transform DB result to frontend format
const transformCustomer = (customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    joinDate: customer.join_date,
    gameProgress: {
        level: customer.level,
        totalScore: customer.total_score,
        highScore: customer.high_score,
    },
    orderHistory: [], // This would require another query to populate
    restaurantId: customer.restaurant_id,
});


// GET all customers for a specific restaurant
router.get('/', async (req, res) => {
    try {
        const { restaurantId } = req.query;
        if (!restaurantId) {
            return res.status(400).json({ msg: 'Restaurant ID is required' });
        }
        const { rows } = await db.query('SELECT * FROM customers WHERE restaurant_id = $1', [restaurantId]);
        res.json(rows.map(transformCustomer));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST "login" a customer
router.post('/login', async (req, res) => {
    try {
        const { phone } = req.body;
        const { rows } = await db.query('SELECT * FROM customers WHERE phone = $1', [phone]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Customer not found' });
        }
        res.json(transformCustomer(rows[0]));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST register a new customer
router.post('/register', async (req, res) => {
    try {
        const { name, phone, restaurantId } = req.body;
        const existingCustomer = await db.query('SELECT * FROM customers WHERE phone = $1', [phone]);
        if (existingCustomer.rows.length > 0) {
            return res.status(400).json({ msg: 'Phone number already registered' });
        }
        const joinDate = new Date().toISOString().split('T')[0];
        const { rows } = await db.query(
            'INSERT INTO customers (id, name, phone, join_date, restaurant_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [phone, name, phone, joinDate, restaurantId]
        );
        res.status(201).json(transformCustomer(rows[0]));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT update customer game progress
router.put('/:id/game', async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        const customerRes = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (customerRes.rows.length === 0) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        const customer = customerRes.rows[0];
        const newTotalScore = customer.total_score + score;
        const newHighScore = Math.max(customer.high_score, score);
        
        const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000];
        const newLevel = LEVEL_THRESHOLDS.filter(t => newTotalScore >= t).length || 1;
        
        const { rows } = await db.query(
            'UPDATE customers SET total_score = $1, high_score = $2, level = $3 WHERE id = $4 RETURNING *',
            [newTotalScore, newHighScore, newLevel, id]
        );
        res.json(transformCustomer(rows[0]));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;
