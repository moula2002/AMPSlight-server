const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const upload = require('../utils/multerConfig');

router.get('/', subcategoryController.getAllSubcategories);
router.post('/', upload.single('image'), subcategoryController.createSubcategory);

module.exports = router;
