const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/multerConfig');

const productUploads = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 },
  { name: 'datasheet', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productUploads, productController.createProduct);
router.put('/:id', productUploads, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
