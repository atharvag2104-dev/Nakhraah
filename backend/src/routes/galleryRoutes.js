const express = require('express');
const GalleryController = require('../controllers/galleryController');
const upload = require('../middlewares/upload');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/categories', GalleryController.getCategories);
router.get('/', GalleryController.getAll);
router.get('/:id', GalleryController.getById);
router.post('/', authenticate, requireAdmin, upload.single('image'), GalleryController.create);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), GalleryController.update);
router.delete('/:id', authenticate, requireAdmin, GalleryController.remove);

module.exports = router;
