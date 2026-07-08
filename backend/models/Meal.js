const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links the meal directly to the specific user who ate it
        required: true
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        required: true
    },
    foodName: {
        type: String,
        required: true,
        trim: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number, // tracked in grams
        default: 0
    },
    carbs: {
        type: Number, // tracked in grams
        default: 0
    },
    fats: {
        type: Number, // tracked in grams
        default: 0
    },
    dateTracked: {
        type: Date,
        default: Date.now // Automatically sets to today's date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meal', MealSchema);