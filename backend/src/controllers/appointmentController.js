const { validationResult } = require('express-validator');
const AppointmentModel = require('../models/Appointment');
const ServiceModel = require('../models/Service');
const ApiError = require('../utils/ApiError');

const AppointmentController = {
  async getAll(req, res, next) {
    try {
      const appointments = await AppointmentModel.findAll({ status: req.query.status });
      res.json({ success: true, data: appointments });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const appointment = await AppointmentModel.findById(req.params.id);
      if (!appointment) throw new ApiError(404, 'Appointment not found');
      res.json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
      }

      const data = { ...req.body };
      if (data.service_id) {
        const service = await ServiceModel.findById(data.service_id);
        if (service) {
          data.service_name = service.name;
        }
      }

      const appointment = await AppointmentModel.create(data);
      res.status(201).json({
        success: true,
        message: 'Appointment request submitted successfully',
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
      }
      const appointment = await AppointmentModel.updateStatus(req.params.id, status);
      if (!appointment) throw new ApiError(404, 'Appointment not found');
      res.json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const deleted = await AppointmentModel.delete(req.params.id);
      if (!deleted) throw new ApiError(404, 'Appointment not found');
      res.json({ success: true, message: 'Appointment deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AppointmentController;
