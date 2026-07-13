const pool = require('../config/database');

const GalleryModel = {
  async findAll({ category, active = true, limit } = {}) {
    let query = 'SELECT * FROM gallery WHERE 1=1';
    const params = [];

    if (active !== undefined) {
      params.push(active);
      query += ` AND is_active = $${params.length}`;
    }
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    if (limit) {
      params.push(limit);
      query += ` LIMIT $${params.length}`;
    }

    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
    return rows[0];
  },

  async create(data) {
    const { title, image_url, category, alt_text, sort_order } = data;
    const { rows } = await pool.query(
      `INSERT INTO gallery (title, image_url, category, alt_text, sort_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, image_url, category, alt_text || title, sort_order || 0]
    );
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    const allowed = ['title', 'image_url', 'category', 'alt_text', 'is_active', 'sort_order'];
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
      `UPDATE gallery SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
    return rowCount > 0;
  },

  async getCategories() {
    const { rows } = await pool.query(
      'SELECT DISTINCT category FROM gallery WHERE is_active = true ORDER BY category'
    );
    return rows.map((r) => r.category);
  },

  async count() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM gallery WHERE is_active = true');
    return rows[0].count;
  },
};

module.exports = GalleryModel;
