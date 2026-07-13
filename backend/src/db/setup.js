const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function setup() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(schema);
    console.log('Database schema created successfully.');
  } catch (err) {
    console.error('Schema setup failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setup();
