// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();

// ------------------- CONFIG -------------------
const PORT = process.env.PORT || 5000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;

// ------------------- MIDDLEWARE -------------------
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));
app.use(bodyParser.json());

// ------------------- MONGODB -------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ------------------- RIMS SCHEMA -------------------
const rimSchema = new mongoose.Schema({
  name: String,
  brand: String,
  size: String,
  price: Number,
  location: String,
  images: {
  type: [String],
  default: [],
},
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Rim = mongoose.model('Rim', rimSchema);

// ------------------- AUTH -------------------
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
// VERIFY TOKEN (used by frontend)
app.post('/api/admin/verify', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    res.json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});


// ------------------- RIMS ROUTES -------------------

// GET all rims
app.get('/api/rims', async (req, res) => {
  try {
    const rims = await Rim.find().sort({ createdAt: -1 });
    res.json(rims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD rim (protected)
// ADD rim (protected) with multiple images
app.post('/api/rims', authenticate, async (req, res) => {
  try {
    const rim = new Rim({
      name: req.body.name,
      brand: req.body.brand,
      size: req.body.size,
      price: req.body.price,
      location: req.body.location,
      images: req.body.images, // ✅ array of image URLs
      featured: req.body.featured || false,
    });

    await rim.save();
    res.status(201).json(rim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE rim (protected)
app.delete('/api/rims/:id', authenticate, async (req, res) => {
  try {
    await Rim.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rim deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ------------------- START SERVER -------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
