const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, category, subcategory } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = new Product({
      title,
      description,
      category,
      subcategory: subcategory || undefined,
      imageUrl
    });

    await product.save();
    const populated = await product.populate([{ path: 'category', select: 'name' }, { path: 'subcategory', select: 'name' }]);
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
