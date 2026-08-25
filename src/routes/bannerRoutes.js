const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../utils/multerConfig');

router.get('/', bannerController.getAllBanners);
router.post('/', upload.single('image'), bannerController.createBanner);
router.put('/:id', upload.single('image'), bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
