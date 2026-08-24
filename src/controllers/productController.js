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
    const { 
      title, sku, category, subcategory, brandName, modelNumber, 
      shortDescription, fullDescription, regularPrice, salePrice, 
      taxPercentage, discountPercentage, stockQuantity, minimumOrderQuantity, 
      stockStatus, isFeatured, isNewArrival, isBestSeller, isTrending, status 
    } = req.body;
    
    // Parse JSON arrays
    let technicalSpecifications = [];
    let features = [];
    let applications = [];
    
    try {
      if (req.body.technicalSpecifications) technicalSpecifications = JSON.parse(req.body.technicalSpecifications);
      if (req.body.features) features = JSON.parse(req.body.features);
      if (req.body.applications) applications = JSON.parse(req.body.applications);
    } catch (e) {
      console.error('Error parsing JSON arrays', e);
    }

    let imageUrl = '', datasheetUrl = '', brochureUrl = '';
    let galleryImages = [];
    
    if (req.files) {
      if (req.files.mainImage) imageUrl = `/uploads/${req.files.mainImage[0].filename}`;
      if (req.files.datasheet) datasheetUrl = `/uploads/${req.files.datasheet[0].filename}`;
      if (req.files.brochure) brochureUrl = `/uploads/${req.files.brochure[0].filename}`;
      
      if (req.files.galleryImages) {
        galleryImages = req.files.galleryImages.map(file => `/uploads/${file.filename}`);
      }
    }

    const product = new Product({
      title, sku, category, subcategory: subcategory || undefined, brandName, modelNumber,
      shortDescription, fullDescription, 
      regularPrice: regularPrice || 0, salePrice, taxPercentage, discountPercentage,
      stockQuantity: stockQuantity || 0, minimumOrderQuantity, stockStatus,
      isFeatured: isFeatured === 'true', isNewArrival: isNewArrival === 'true', 
      isBestSeller: isBestSeller === 'true', isTrending: isTrending === 'true', status,
      technicalSpecifications, features, applications,
      metaTitle: req.body.metaTitle, metaDescription: req.body.metaDescription, metaKeywords: req.body.metaKeywords,
      imageUrl, galleryImages, datasheetUrl, brochureUrl
    });

    await product.save();
    const populated = await product.populate([{ path: 'category', select: 'name' }, { path: 'subcategory', select: 'name' }]);
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { 
      title, sku, category, subcategory, brandName, modelNumber, 
      shortDescription, fullDescription, regularPrice, salePrice, 
      taxPercentage, discountPercentage, stockQuantity, minimumOrderQuantity, 
      stockStatus, isFeatured, isNewArrival, isBestSeller, isTrending, status,
      metaTitle, metaDescription, metaKeywords
    } = req.body;

    // Update basic fields
    if (title) product.title = title;
    if (sku) product.sku = sku;
    if (category) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory || undefined;
    if (brandName !== undefined) product.brandName = brandName;
    if (modelNumber !== undefined) product.modelNumber = modelNumber;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (fullDescription !== undefined) product.fullDescription = fullDescription;
    
    // Pricing & Inventory
    if (regularPrice !== undefined) product.regularPrice = regularPrice;
    if (salePrice !== undefined) product.salePrice = salePrice;
    if (taxPercentage !== undefined) product.taxPercentage = taxPercentage;
    if (discountPercentage !== undefined) product.discountPercentage = discountPercentage;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (minimumOrderQuantity !== undefined) product.minimumOrderQuantity = minimumOrderQuantity;
    if (stockStatus !== undefined) product.stockStatus = stockStatus;
    
    // SEO & Status
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined) product.metaDescription = metaDescription;
    if (metaKeywords !== undefined) product.metaKeywords = metaKeywords;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival === 'true';
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller === 'true';
    if (isTrending !== undefined) product.isTrending = isTrending === 'true';
    if (status !== undefined) product.status = status;

    // Parse JSON arrays
    try {
      if (req.body.technicalSpecifications) product.technicalSpecifications = JSON.parse(req.body.technicalSpecifications);
      if (req.body.features) product.features = JSON.parse(req.body.features);
      if (req.body.applications) product.applications = JSON.parse(req.body.applications);
    } catch (e) {
      console.error('Error parsing JSON arrays', e);
    }

    // Files
    if (req.files) {
      if (req.files.mainImage) product.imageUrl = `/uploads/${req.files.mainImage[0].filename}`;
      if (req.files.datasheet) product.datasheetUrl = `/uploads/${req.files.datasheet[0].filename}`;
      if (req.files.brochure) product.brochureUrl = `/uploads/${req.files.brochure[0].filename}`;
      
      // If new gallery images are uploaded, append them (or replace, depending on logic. Here we replace for simplicity or you can append if you want).
      if (req.files.galleryImages) {
        // Here we just replace them. If we want to append, we would do:
        // product.galleryImages = [...product.galleryImages, ...req.files.galleryImages.map(f => `/uploads/${f.filename}`)];
        product.galleryImages = req.files.galleryImages.map(file => `/uploads/${file.filename}`);
      }
    }

    await product.save();
    const populated = await product.populate([{ path: 'category', select: 'name' }, { path: 'subcategory', select: 'name' }]);
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
