const pool = require('../config/database');

const AppointmentModel = {
  async findAll({ status } = {}) {
    let query = `SELECT a.*, s.name AS service_name_linked
                 FROM appointments a
                 LEFT JOIN services s ON a.service_id = s.id
                 WHERE 1=1`;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }

    query += ' ORDER BY a.preferred_date DESC, a.preferred_time DESC';
    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT a.*, s.name AS service_name_linked
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1`,
      [id]
    );
    return rows[0];
  },

  async create(data) {
    const { name, phone, email, service_id, service_name, preferred_date, preferred_time, message } = data;
    const { rows } = await pool.query(
      `INSERT INTO appointments (name, phone, email, service_id, service_name, preferred_date, preferred_time, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, phone, email, service_id || null, service_name, preferred_date, preferred_time, message]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM appointments');
    return rows[0].count;
  },

  async countByStatus() {
    const { rows } = await pool.query(
      `SELECT status, COUNT(*)::int AS count FROM appointments GROUP BY status`
    );
    return rows;
  },
};

module.exports = AppointmentModel;
