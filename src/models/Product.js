const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: String }
}, { _id: false });

const productSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  brandName: { type: String, trim: true },
  modelNumber: { type: String, trim: true },
  shortDescription: { type: String, trim: true },
  fullDescription: { type: String, trim: true },
  
  // Product Images & Documents
  imageUrl: { type: String }, // Main Product Image
  galleryImages: [{ type: String }],
  datasheetUrl: { type: String },
  brochureUrl: { type: String },
  
  // Pricing
  regularPrice: { type: Number, required: true },
  salePrice: { type: Number },
  taxPercentage: { type: Number },
  discountPercentage: { type: Number },
  
  // Inventory
  stockQuantity: { type: Number, required: true, default: 0 },
  minimumOrderQuantity: { type: Number, default: 1 },
  stockStatus: { type: String, enum: ['In Stock', 'Out Of Stock', 'Pre Order'], default: 'In Stock' },
  
  // Technical Specifications & Features
  technicalSpecifications: [specificationSchema],
  features: [{ type: String }],
  applications: [{ type: String }],
  
  // SEO
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  metaKeywords: { type: String, trim: true },
  
  // Product Status
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
