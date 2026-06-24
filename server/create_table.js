const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS admission_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, function(err) {
  if (err) console.error(err);
  else console.log('Table admission_files created successfully!');
});
