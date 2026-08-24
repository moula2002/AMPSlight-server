const Subcategory = require('../models/Subcategory');

const slugify = (text) => text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-');

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category', 'name').sort({ displayOrder: 1, createdAt: -1 });
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { name, description, category, metaTitle, metaDescription, metaKeywords, displayOrder, isFeatured, status } = req.body;
    
    const slug = slugify(name);
    
    let imageUrl = '', bannerImageUrl = '';
    
    const toBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    if (req.files) {
      if (req.files.image) imageUrl = toBase64(req.files.image[0]);
      if (req.files.banner) bannerImageUrl = toBase64(req.files.banner[0]);
    }

    const subcategory = new Subcategory({
      name,
      slug,
      description,
      category,
      metaTitle,
      metaDescription,
      metaKeywords,
      displayOrder: displayOrder || 0,
      isFeatured: isFeatured === 'true',
      status: status || 'Active',
      imageUrl,
      bannerImageUrl
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
    const { name, description, category, metaTitle, metaDescription, metaKeywords, displayOrder, isFeatured, status } = req.body;
    const subcategory = await Subcategory.findById(req.params.id);
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    if (name) {
      subcategory.name = name;
      subcategory.slug = slugify(name);
    }
    
    subcategory.description = description !== undefined ? description : subcategory.description;
    subcategory.category = category !== undefined ? category : subcategory.category;
    subcategory.metaTitle = metaTitle !== undefined ? metaTitle : subcategory.metaTitle;
    subcategory.metaDescription = metaDescription !== undefined ? metaDescription : subcategory.metaDescription;
    subcategory.metaKeywords = metaKeywords !== undefined ? metaKeywords : subcategory.metaKeywords;
    subcategory.displayOrder = displayOrder !== undefined ? displayOrder : subcategory.displayOrder;
    subcategory.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : subcategory.isFeatured;
    subcategory.status = status !== undefined ? status : subcategory.status;
    
    const toBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    if (req.files) {
      if (req.files.image) subcategory.imageUrl = toBase64(req.files.image[0]);
      if (req.files.banner) subcategory.bannerImageUrl = toBase64(req.files.banner[0]);
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
