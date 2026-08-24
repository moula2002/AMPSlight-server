const Category = require('../models/Category');
const Product = require('../models/Product');

const slugify = (text) => text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' }).sort({ displayOrder: 1, createdAt: -1 });
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id, status: 'Active' })
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
    const { name, description, metaTitle, metaDescription, metaKeywords, displayOrder, isFeatured, status } = req.body;
    
    const slug = slugify(name);
    
    let imageUrl = '', bannerImageUrl = '', iconUrl = '';
    
    const toBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    if (req.files) {
      if (req.files.image) imageUrl = toBase64(req.files.image[0]);
      if (req.files.banner) bannerImageUrl = toBase64(req.files.banner[0]);
      if (req.files.icon) iconUrl = toBase64(req.files.icon[0]);
    }

    const category = new Category({
      name,
      slug,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
      displayOrder: displayOrder || 0,
      isFeatured: isFeatured === 'true',
      status: status || 'Active',
      imageUrl,
      bannerImageUrl,
      iconUrl
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, metaTitle, metaDescription, metaKeywords, displayOrder, isFeatured, status } = req.body;
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    
    category.description = description !== undefined ? description : category.description;
    category.metaTitle = metaTitle !== undefined ? metaTitle : category.metaTitle;
    category.metaDescription = metaDescription !== undefined ? metaDescription : category.metaDescription;
    category.metaKeywords = metaKeywords !== undefined ? metaKeywords : category.metaKeywords;
    category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;
    category.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : category.isFeatured;
    category.status = status !== undefined ? status : category.status;
    
    const toBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    if (req.files) {
      if (req.files.image) category.imageUrl = toBase64(req.files.image[0]);
      if (req.files.banner) category.bannerImageUrl = toBase64(req.files.banner[0]);
      if (req.files.icon) category.iconUrl = toBase64(req.files.icon[0]);
    }

    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
