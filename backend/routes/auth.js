const router = require('express').Router();
const User = require('../models/User');

// REGISTRATION ROUTE (Placeholder)
router.post('/register', async (req, res) => {
    res.send('Register route is connected!');
});

// LOGIN ROUTE (Placeholder)
router.post('/login', async (req, res) => {
    res.send('Login route is connected!');
});

module.exports = router;