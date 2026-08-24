const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/multerConfig');

router.get('/', productController.getAllProducts);
router.post('/', upload.single('image'), productController.createProduct);

module.exports = router;
