// Force Node.js process to use Google DNS directly, bypassing hotspot network blocks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// 🗄️ DATABASE SCHEMAS
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  fitnessGoal: { type: String }
}, { timestamps: true });

const mealSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  foodName: { type: String, required: true },
  mealWindow: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

// 🌐 ROUTING ENDPOINTS
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, age, weight, height, fitnessGoal } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email address already registered in Atlas.' });
    }
    const newUser = new User({ email, password, age, weight, height, fitnessGoal });
    await newUser.save();
    return res.status(201).json({ message: 'Profile created!' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

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

app.post('/api/meals/log', async (req, res) => {
  try {
    const { userEmail, foodName, mealWindow, calories, protein, carbs, fats } = req.body;
    const newMeal = new Meal({ userEmail, foodName, mealWindow, calories, protein, carbs, fats });
    await newMeal.save();
    return res.status(201).json({ message: 'Meal logged successfully!', newMeal });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to record tracking parameters.' });
  }
});

app.get('/api/meals/history/:email', async (req, res) => {
  try {
    const history = await Meal.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve ledger.' });
  }
});

// 🗑️ CONTROL ROUTE: DELETES A TARGET MEAL FROM MONGO ATLAS
app.delete('/api/meals/delete/:id', async (req, res) => {
  try {
    const deletedDocument = await Meal.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found inside collection mapping." });
    }
    console.log(`🗑️ [Atlas Sync] Removed meal entry ID: ${req.params.id}`);
    return res.status(200).json({ message: "Successfully dropped meal from cluster collection." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal engine delete failure." });
  }
});

app.get('/', (req, res) => {
    res.send('Nutrition Assistant Cloud MERN Backend is Active!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB Database Connected Successfully!");
    app.listen(PORT, () => console.log(`🚀 Server executing on port: ${PORT}`));
  })
  .catch((err) => console.error("❌ Link dropped:", err.message));