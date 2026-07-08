const router = require('express').Router();
const User = require('../models/User');

const bcrypt = require('bcryptjs');

// REGISTER USER
router.post('/register', async (req, res) => {
    try {
        // 1. Check if the user's email already exists in your database
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 2. Encrypt/Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 3. Create the user with their incoming physical profile data
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age,
            weight: req.body.weight, // in kg
            height: req.body.height, // in cm
            fitnessGoal: req.body.fitnessGoal // 'Weight Loss', 'Muscle Hypertrophy', or 'Maintenance'
        });

        // 4. Save the user data to MongoDB
        const savedUser = await newUser.save();
        
        // Strip out the password from the server response for safety
        const { password, ...userInfo } = savedUser._doc;
        res.status(201).json(userInfo);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// LOGIN USER
router.post('/login', async (req, res) => {
    try {
        // 1. Find the user by their email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2. Compare incoming password with the encrypted password in MongoDB
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Return user profile metrics for the app UI (excluding password)
        const { password, ...userInfo } = user._doc;
        res.status(200).json(userInfo);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
