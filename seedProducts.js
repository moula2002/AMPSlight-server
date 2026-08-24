require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const productCategories = [
  {
    title: "Commercial Lighting",
    description: "High-performance fixtures designed for offices, retail spaces, and public buildings. Combining aesthetics with optimal lumen output.",
    features: ["Panel Lights", "Downlights", "Track Lighting", "Linear Pendants"]
  },
  {
    title: "Industrial Lighting",
    description: "Rugged, durable lighting solutions built to withstand harsh environments while maximizing safety and visibility.",
    features: ["High Bay Lights", "Flood Lights", "Vapor Tight Fixtures", "Explosion Proof"]
  },
  {
    title: "Residential Lighting",
    description: "Elegant and warm lighting options to enhance the comfort and beauty of living spaces.",
    features: ["Chandeliers", "Wall Sconces", "Recessed Lighting", "Outdoor Landscape"]
  },
  {
    title: "Smart Lighting",
    description: "Intelligent systems with IoT integration for automated control, energy tracking, and adaptive illumination.",
    features: ["Sensors", "Dimming Controls", "Smart Bulbs", "Centralized Hubs"]
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI is not set. Please check your .env file.');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Optionally clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing categories and products');

    for (const catData of productCategories) {
      const category = new Category({
        name: catData.title,
        description: catData.description,
      });
      await category.save();
      console.log(`Created category: ${category.name}`);

      for (const feature of catData.features) {
        const product = new Product({
          title: feature,
          description: `High quality ${feature.toLowerCase()} for ${catData.title.toLowerCase()}`,
          category: category._id
        });
        await product.save();
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
};

seedDB();
