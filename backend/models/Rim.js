const mongoose = require('mongoose');

const rimSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },

  // Replace single image with multiple images
  images: { type: [String], default: [] }, 

  featured: { type: Boolean, default: false },

  // Optional analytics fields
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Rim', rimSchema);
