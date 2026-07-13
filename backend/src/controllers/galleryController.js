const GalleryModel = require('../models/Gallery');
const ApiError = require('../utils/ApiError');

const GalleryController = {
  async getAll(req, res, next) {
    try {
      const { category, limit } = req.query;
      const active = req.user ? undefined : true;
      const gallery = await GalleryModel.findAll({
        category,
        active: req.query.active === 'false' ? false : active ?? true,
        limit: limit ? parseInt(limit, 10) : undefined,
      });
      res.json({ success: true, data: gallery });
    } catch (err) {
      next(err);
    }
  },

  async getCategories(req, res, next) {
    try {
      const categories = await GalleryModel.getCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await GalleryModel.findById(req.params.id);
      if (!item) throw new ApiError(404, 'Gallery item not found');
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.image_url = `/uploads/${req.file.filename}`;
      }
      if (!data.image_url) {
        throw new ApiError(400, 'Image is required');
      }
      const item = await GalleryModel.create(data);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.image_url = `/uploads/${req.file.filename}`;
      }
      const item = await GalleryModel.update(req.params.id, data);
      if (!item) throw new ApiError(404, 'Gallery item not found');
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const deleted = await GalleryModel.delete(req.params.id);
      if (!deleted) throw new ApiError(404, 'Gallery item not found');
      res.json({ success: true, message: 'Gallery item deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = GalleryController;
