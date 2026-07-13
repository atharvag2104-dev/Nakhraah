const pool = require('../config/database');

const TestimonialModel = {
  async findAll({ featured, active = true } = {}) {
    let query = 'SELECT * FROM testimonials WHERE 1=1';
    const params = [];

    if (active !== undefined) {
      params.push(active);
      query += ` AND is_active = $${params.length}`;
    }
    if (featured !== undefined) {
      params.push(featured);
      query += ` AND is_featured = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id]);
    return rows[0];
  },

  async create(data) {
    const { client_name, client_image, rating, review, is_featured } = data;
    const { rows } = await pool.query(
      `INSERT INTO testimonials (client_name, client_image, rating, review, is_featured)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [client_name, client_image, rating, review, is_featured || false]
    );
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    const allowed = ['client_name', 'client_image', 'rating', 'review', 'is_featured', 'is_active'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = NOW()');
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE testimonials SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM testimonials WHERE is_active = true');
    return rows[0].count;
  },
};

module.exports = TestimonialModel;
