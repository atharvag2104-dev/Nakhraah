const ServiceModel = require('../models/Service');
const ApiError = require('../utils/ApiError');

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const ServiceController = {
  async getAll(req, res, next) {
    try {
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
      const active = req.query.active === 'false' ? false : true;
      const services = await ServiceModel.findAll({ featured, active: req.user ? active : true });
      res.json({ success: true, data: services });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const service = await ServiceModel.findById(req.params.id);
      if (!service) throw new ApiError(404, 'Service not found');
      res.json({ success: true, data: service });
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
      if (!data.slug && data.name) {
        data.slug = slugify(data.name);
      }
      const service = await ServiceModel.create(data);
      res.status(201).json({ success: true, data: service });
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
      const service = await ServiceModel.update(req.params.id, data);
      if (!service) throw new ApiError(404, 'Service not found');
      res.json({ success: true, data: service });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const deleted = await ServiceModel.delete(req.params.id);
      if (!deleted) throw new ApiError(404, 'Service not found');
      res.json({ success: true, message: 'Service deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ServiceController;
