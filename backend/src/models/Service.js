const pool = require('../config/database');

const ServiceModel = {
  async findAll({ featured, active = true } = {}) {
    let query = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (active !== undefined) {
      params.push(active);
      query += ` AND is_active = $${params.length}`;
    }
    if (featured !== undefined) {
      params.push(featured);
      query += ` AND is_featured = $${params.length}`;
    }

    query += ' ORDER BY sort_order ASC, name ASC';
    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    return rows[0];
  },

  async findBySlug(slug) {
    const { rows } = await pool.query('SELECT * FROM services WHERE slug = $1', [slug]);
    return rows[0];
  },

  async create(data) {
    const { name, slug, description, price, duration_minutes, image_url, category, is_featured, sort_order } = data;
    const { rows } = await pool.query(
      `INSERT INTO services (name, slug, description, price, duration_minutes, image_url, category, is_featured, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, slug, description, price, duration_minutes, image_url, category, is_featured || false, sort_order || 0]
    );
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    const allowed = ['name', 'slug', 'description', 'price', 'duration_minutes', 'image_url', 'category', 'is_featured', 'is_active', 'sort_order'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE services SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM services WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM services WHERE is_active = true');
    return rows[0].count;
  },
};

module.exports = ServiceModel;
