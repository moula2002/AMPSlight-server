const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort('displayOrder');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { title, linkUrl, displayOrder, isActive } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Banner image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const banner = new Banner({
      title,
      imageUrl,
      linkUrl,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    const { title, linkUrl, displayOrder, isActive } = req.body;

    if (title !== undefined) banner.title = title;
    if (linkUrl !== undefined) banner.linkUrl = linkUrl;
    if (displayOrder !== undefined) banner.displayOrder = displayOrder;
    if (isActive !== undefined) banner.isActive = isActive;

    if (req.file) {
      // Remove old image if it exists
      if (banner.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', '..', banner.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      banner.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    // Remove image file
    if (banner.imageUrl) {
      const imagePath = path.join(__dirname, '..', '..', banner.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await banner.deleteOne();
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
