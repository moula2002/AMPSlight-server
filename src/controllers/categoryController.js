const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id })
          .limit(4)
          .sort({ createdAt: -1 });
        return {
          ...category.toObject(),
          products,
        };
      })
    );
    res.json(categoriesWithProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const category = new Category({
      name,
      description,
      imageUrl
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
