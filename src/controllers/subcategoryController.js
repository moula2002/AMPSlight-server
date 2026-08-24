const Subcategory = require('../models/Subcategory');

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category', 'name').sort({ createdAt: -1 });
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const subcategory = new Subcategory({
      name,
      description,
      category,
      imageUrl
    });

    await subcategory.save();
    const populated = await subcategory.populate('category', 'name');
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
