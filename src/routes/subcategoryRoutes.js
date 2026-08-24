const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const upload = require('../utils/multerConfig');

router.get('/', subcategoryController.getAllSubcategories);
router.post('/', upload.single('image'), subcategoryController.createSubcategory);
router.put('/:id', upload.single('image'), subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
