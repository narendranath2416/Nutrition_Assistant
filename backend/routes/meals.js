const router = require('express').Router();
const Meal = require('../models/Meal');

// 1. ADD A NEW MEAL LOG Entry
router.post('/add', async (req, res) => {
    try {
        const newMeal = new Meal({
            userId: req.body.userId,
            mealType: req.body.mealType, // Breakfast, Lunch, Dinner, or Snack
            foodName: req.body.foodName,
            calories: req.body.calories,
            protein: req.body.protein,
            carbs: req.body.carbs,
            fats: req.body.fats
        });

        const savedMeal = await newMeal.save();
        res.status(201).json(savedMeal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL MEAL LOGS FOR A SPECIFIC USER
router.get('/user/:userId', async (req, res) => {
    try {
        const meals = await Meal.find({ userId: req.params.userId }).sort({ dateTracked: -1 });
        res.status(200).json(meals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;