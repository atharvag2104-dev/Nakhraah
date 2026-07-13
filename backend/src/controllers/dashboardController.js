const ServiceModel = require('../models/Service');
const GalleryModel = require('../models/Gallery');
const TestimonialModel = require('../models/Testimonial');
const AppointmentModel = require('../models/Appointment');
const ApiError = require('../utils/ApiError');

const DashboardController = {
  async getStats(req, res, next) {
    try {
      const [services, gallery, testimonials, appointments, statusBreakdown] = await Promise.all([
        ServiceModel.count(),
        GalleryModel.count(),
        TestimonialModel.count(),
        AppointmentModel.count(),
        AppointmentModel.countByStatus(),
      ]);

      res.json({
        success: true,
        data: {
          services,
          gallery,
          testimonials,
          appointments,
          appointmentsByStatus: statusBreakdown,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = DashboardController;
