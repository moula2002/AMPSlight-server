const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const upload = require('../utils/multerConfig');

router.get('/', categoryController.getAllCategories);
router.get('/with-products', categoryController.getCategoriesWithProducts);
router.post('/', upload.single('image'), categoryController.createCategory);

module.exports = router;
