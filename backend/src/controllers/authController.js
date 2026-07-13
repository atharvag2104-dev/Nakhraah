const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const AuthController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw new ApiError(401, 'Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        throw new ApiError(401, 'Invalid credentials');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
      );

      res.json({
        success: true,
        data: {
          token,
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) throw new ApiError(404, 'User not found');
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
