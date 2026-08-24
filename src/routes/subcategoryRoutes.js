const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const upload = require('../utils/multerConfig');

const subcategoryUploads = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);

router.get('/', subcategoryController.getAllSubcategories);
router.post('/', subcategoryUploads, subcategoryController.createSubcategory);
router.put('/:id', subcategoryUploads, subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
