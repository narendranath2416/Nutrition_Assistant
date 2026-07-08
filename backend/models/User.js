const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // Nutrition Profile metrics
    age: { type: Number },
    weight: { type: Number }, // in kg
    height: { type: Number }, // in cm
    fitnessGoal: { 
        type: String, 
        enum: ['Weight Loss', 'Muscle Hypertrophy', 'Maintenance'],
        default: 'Maintenance'
    }
}, {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);