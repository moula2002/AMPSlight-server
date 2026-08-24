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

exports.updateSubcategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const subcategory = await Subcategory.findById(req.params.id);
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subcategory.name = name || subcategory.name;
    subcategory.description = description || subcategory.description;
    subcategory.category = category || subcategory.category;
    
    if (req.file) {
      subcategory.imageUrl = `/uploads/${req.file.filename}`;
    }

    await subcategory.save();
    const populated = await subcategory.populate('category', 'name');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    await subcategory.deleteOne();
    res.json({ message: 'Subcategory deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
