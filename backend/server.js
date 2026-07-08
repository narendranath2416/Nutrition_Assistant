const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Add this line near the top with your other requires
const authRoute = require('./routes/auth');
const mealRoute = require('./routes/meals');
// Add this line right below your app.use(express.json()); middleware
app.use('/api/user', authRoute);
app.use('/api/meals', mealRoute);
// Test Route
app.get('/', (req, res) => {
    res.send('Nutrition Assistant Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});