const { query } = require('./db');
const fs = require('fs');
const path = require('path');

const directorsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'directors.json'), 'utf8'));

async function importDirectors() {
  console.log('Ensuring directors table exists...');
  await query.run(`
    CREATE TABLE IF NOT EXISTS directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photo_url TEXT,
      mobile_number TEXT,
      email TEXT,
      college_name TEXT,
      college_address TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Clearing existing directors...');
  await query.run('DELETE FROM directors');

  console.log(`Inserting ${directorsData.length} physical education directors...`);
  for (const d of directorsData) {
    await query.run(
      'INSERT INTO directors (name, photo_url, mobile_number, email, college_name, college_address, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [d.name, d.photo_url, d.mobile_number, d.email, d.college_name, d.college_address, d.sort_order]
    );
    console.log(`  ✓ ${d.sort_order}. ${d.name}`);
  }

  const count = await query.get('SELECT COUNT(*) as cnt FROM directors');
  console.log(`\nImport complete! ${count.cnt} directors in database.`);
  process.exit(0);
}

importDirectors().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
