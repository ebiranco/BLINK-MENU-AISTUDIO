// backend/routes/media.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// POST a new AI-generated media asset
// In a real application, this would take the base64 data, upload it to a cloud storage (like S3),
// get a URL, and then save that URL to the database.
// For this simulation, we'll just create a placeholder record with a placeholder URL.
router.post('/generated', async (req, res) => {
    const { imageData, videoData, type, restaurantId } = req.body; // Expecting base64 data

    if (!type || (type !== 'image' && type !== 'video')) {
        return res.status(400).json({ msg: 'Invalid media type' });
    }
     if (!imageData && !videoData) {
        return res.status(400).json({ msg: 'No media data provided' });
    }

    try {
        // SIMULATION: In a real app, upload logic to S3/Cloudinary would go here.
        // We'll just generate a placeholder URL.
        const placeholderUrl = `/media/generated/${type}-${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`;

        const { rows } = await db.query(
            'INSERT INTO media_assets (url, type, restaurant_id) VALUES ($1, $2, $3) RETURNING *',
            [placeholderUrl, type, restaurantId]
        );
        
        // Return the newly created asset info, including its persistent (placeholder) URL
        res.status(201).json(rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error while saving media asset');
    }
});

module.exports = router;
