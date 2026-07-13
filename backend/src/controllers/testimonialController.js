const TestimonialModel = require('../models/Testimonial');
const ApiError = require('../utils/ApiError');

const TestimonialController = {
  async getAll(req, res, next) {
    try {
      const featured = req.query.featured === 'true' ? true : undefined;
      const testimonials = await TestimonialModel.findAll({
        featured,
        active: req.query.active === 'false' ? false : true,
      });
      res.json({ success: true, data: testimonials });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await TestimonialModel.findById(req.params.id);
      if (!item) throw new ApiError(404, 'Testimonial not found');
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const item = await TestimonialModel.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const item = await TestimonialModel.update(req.params.id, req.body);
      if (!item) throw new ApiError(404, 'Testimonial not found');
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const deleted = await TestimonialModel.delete(req.params.id);
      if (!deleted) throw new ApiError(404, 'Testimonial not found');
      res.json({ success: true, message: 'Testimonial deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = TestimonialController;
