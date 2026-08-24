const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

exports.getStats = async (req, res) => {
  try {
    const categoriesCount = await Category.countDocuments();
    const subcategoriesCount = await Subcategory.countDocuments();
    const productsCount = await Product.countDocuments();

    res.json({
      categories: categoriesCount,
      subcategories: subcategoriesCount,
      products: productsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
