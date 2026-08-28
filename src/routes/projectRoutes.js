const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { getAllProjects, createProject, deleteProject, updateProject } = require('../controllers/projectController');

router.get('/', getAllProjects);
router.post('/', upload.single('image'), createProject);
router.put('/:id', upload.single('image'), updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
