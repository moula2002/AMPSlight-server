const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String }, // Main Category Image
  bannerImageUrl: { type: String },
  iconUrl: { type: String },
  
  // SEO
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  metaKeywords: { type: String, trim: true },
  
  // Settings
  displayOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
