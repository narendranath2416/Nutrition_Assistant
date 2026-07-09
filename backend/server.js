// Force Node.js process to use Google DNS directly, bypassing hotspot network blocks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({ origin: '*' }));
app.use(express.json());

// Import Database Routing Blueprints
const authRoute = require('./routes/auth');
const mealRoute = require('./routes/meals');

// Apply Route Mappings
app.use('/api/user', authRoute);
app.use('/api/meals', mealRoute);

// Base System Status Route
app.get('/', (req, res) => {
    res.send('Nutrition Assistant Cloud MERN Backend is Active!');
});

// Cloud Database Connection Orchestration
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("🔥 MongoDB Database Connected Successfully!");
        app.listen(PORT, () => {
            console.log(`🚀 Server is officially executing on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });