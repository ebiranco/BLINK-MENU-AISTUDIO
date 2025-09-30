// backend/routes/menu.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to transform DB result to frontend format
const transformMenuItem = (item) => ({
    id: item.id,
    name: { en: item.name_en, fa: item.name_fa },
    description: { en: item.description_en, fa: item.description_fa },
    price: item.price,
    prepTime: item.prep_time,
    imageUrl: item.image_url,
    allergens: item.allergens_en.map((en, i) => ({ en, fa: item.allergens_fa[i] || en })),
    isFavorite: item.is_favorite,
    categoryId: item.category_id,
    restaurantId: item.restaurant_id,
});

// GET all menu categories
router.get('/categories', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM menu_categories');
    const formattedRows = rows.map(cat => ({
        id: cat.id,
        name: { en: cat.name_en, fa: cat.name_fa },
        imageUrl: cat.image_url,
        restaurantId: cat.restaurant_id
    }));
    res.json(formattedRows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET all menu items
router.get('/items', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM menu_items ORDER BY id');
    res.json(rows.map(transformMenuItem));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
