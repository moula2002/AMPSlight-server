const Banner = require('../models/Banner');

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

    const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

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
      banner.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
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

    await banner.deleteOne();
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
