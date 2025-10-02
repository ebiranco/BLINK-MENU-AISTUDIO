// backend/routes/restaurants.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

const transformRestaurant = (dbRow) => ({
    id: dbRow.id,
    name: dbRow.name,
    owner: dbRow.owner,
    status: dbRow.status,
    joinDate: dbRow.join_date,
    credits: dbRow.credits,
    isGameActive: dbRow.is_game_active,
    isCustomerClubActive: dbRow.is_customer_club_active,
});


// GET a specific restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM restaurants WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        res.json(transformRestaurant(rows[0]));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET all restaurants for platform admin
router.get('/', async (req, res) => {
     try {
        const { rows } = await db.query('SELECT * FROM restaurants ORDER BY join_date DESC');
        res.json(rows.map(transformRestaurant));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT update restaurant credits
router.put('/:id/credits', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ msg: 'Invalid credit amount' });
        }
        const { rows } = await db.query(
            'UPDATE restaurants SET credits = credits + $1 WHERE id = $2 RETURNING *',
            [amount, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        res.json(transformRestaurant(rows[0]));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT update restaurant features (game, customer club)
router.put('/:id/features', async (req, res) => {
    try {
        const { id } = req.params;
        const { feature, cost } = req.body;

        const restaurantResult = await db.query('SELECT credits FROM restaurants WHERE id = $1', [id]);
        if (restaurantResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        if (restaurantResult.rows[0].credits < cost) {
            return res.status(400).json({ msg: 'Insufficient credits' });
        }

        let updateQuery;
        if (feature === 'game') {
            updateQuery = 'UPDATE restaurants SET is_game_active = TRUE, credits = credits - $1 WHERE id = $2 RETURNING *';
        } else if (feature === 'customerClub') {
            updateQuery = 'UPDATE restaurants SET is_customer_club_active = TRUE, credits = credits - $1 WHERE id = $2 RETURNING *';
        } else {
            return res.status(400).json({ msg: 'Invalid feature' });
        }
        
        const { rows } = await db.query(updateQuery, [cost, id]);
        res.json(transformRestaurant(rows[0]));

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
