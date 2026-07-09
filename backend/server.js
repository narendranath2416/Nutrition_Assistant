// Force Node.js process to use Google DNS directly, bypassing hotspot network blocks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Middleware Architecture Configuration
app.use(cors({ origin: '*' }));
app.use(express.json());

// 🗄️ DATABASE DATA CONFIGURATION SCHEMAS
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  fitnessGoal: { type: String }
}, { timestamps: true });

const mealSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // Links meal items to the logged-in user session
  foodName: { type: String, required: true },
  mealWindow: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

// 🌐 ROUTE 1: USER REGISTRATION PIPELINE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, age, weight, height, fitnessGoal } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email address already registered in Atlas.' });
    }

    const newUser = new User({ email, password, age, weight, height, fitnessGoal });
    await newUser.save();
    
    console.log(`🔥 [Atlas User Sync] Profile recorded successfully: ${email}`);
    return res.status(201).json({ message: 'Profile created!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 🌐 ROUTE 2: USER LOGIN CREDENTIAL VERIFICATION
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid entry credentials.' });
    }
    return res.status(200).json({ message: 'Authorized' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 🌐 ROUTE 3: PERSIST NEW DIETARY MEAL TO CLOUD
app.post('/api/meals/log', async (req, res) => {
  try {
    const { userEmail, foodName, mealWindow, calories, protein, carbs, fats } = req.body;
    const newMeal = new Meal({ userEmail, foodName, mealWindow, calories, protein, carbs, fats });
    await newMeal.save();
    
    console.log(`📦 [Atlas Meal Sync] Food record logged for context: ${userEmail}`);
    return res.status(201).json({ message: 'Meal document logged successfully!', newMeal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to record tracking parameters.' });
  }
});

// 🌐 ROUTE 4: FETCH HISTORICAL MEALS STREAM FOR THE ACTIVE SESSION USER
app.get('/api/meals/history/:email', async (req, res) => {
  try {
    const history = await Meal.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve cloud ledger information.' });
  }
});

// Mongoose Connection Orchestration
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB Database Connected Successfully!");
    app.listen(PORT, () => console.log(`🚀 Backend executing server listening on port: ${PORT}`));
  })
  .catch((err) => console.error("❌ Link dropped:", err.message));