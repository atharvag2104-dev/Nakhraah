const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const env = require('../config/env');
const { services, gallery } = require('./seed-images');

const testimonials = [
  { name: 'Priya Sharma', rating: 5, review: 'Absolutely stunning work! My bridal nails were a dream. The sisters are true artists.', featured: true },
  { name: 'Ananya Patel', rating: 5, review: 'Best nail studio in town. The attention to detail and hygiene standards are impeccable.', featured: true },
  { name: 'Meera Kapoor', rating: 5, review: 'I have been coming here for months. Every design is better than the last. Pure luxury!', featured: true },
  { name: 'Sneha Reddy', rating: 5, review: 'The chrome nails I got were show-stoppers. Everyone asked where I got them done.', featured: false },
  { name: 'Kavya Iyer', rating: 5, review: 'Warm, welcoming atmosphere and nails that last for weeks. Highly recommend!', featured: false },
];

async function seed() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || env.jwt?.adminEmail || 'admin@nakhraah.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hash = await bcrypt.hash(adminPassword, 12);

    await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [adminEmail, hash, 'Studio Admin', 'admin']
    );

    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      await pool.query(
        `INSERT INTO services (name, slug, description, price, duration_minutes, image_url, category, is_featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO NOTHING`,
        [s.name, s.slug, s.description, s.price, s.duration, s.image, s.category, s.featured, i]
      );
    }

    const galleryCount = await pool.query('SELECT COUNT(*) FROM gallery');
    if (parseInt(galleryCount.rows[0].count, 10) === 0) {
      for (let i = 0; i < gallery.length; i++) {
        const g = gallery[i];
        await pool.query(
          `INSERT INTO gallery (title, image_url, category, alt_text, sort_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [g.title, g.image, g.category, g.title, i]
        );
      }
    }

    const testimonialCount = await pool.query('SELECT COUNT(*) FROM testimonials');
    if (parseInt(testimonialCount.rows[0].count, 10) === 0) {
      for (const t of testimonials) {
        await pool.query(
          `INSERT INTO testimonials (client_name, rating, review, is_featured)
           VALUES ($1, $2, $3, $4)`,
          [t.name, t.rating, t.review, t.featured]
        );
      }
    }

    console.log('Database seeded successfully.');
    console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
