const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'alumni.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Establish Database Connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
      if (pragmaErr) console.error('Failed to enable foreign keys:', pragmaErr.message);
    });
    initializeDatabase();
  }
});

// Run Schema initialization
function initializeDatabase() {
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error executing schema.sql:', err.message);
      } else {
        console.log('Database schema verified & seeded successfully.');
        db.run("ALTER TABLE committee_members ADD COLUMN profile_pdf_url TEXT;", () => {});
        db.run("ALTER TABLE committee_members ADD COLUMN profile_pdf_name TEXT;", () => {});
        db.run("ALTER TABLE directors ADD COLUMN profile_pdf_url TEXT;", () => {});
        db.run("ALTER TABLE directors ADD COLUMN profile_pdf_name TEXT;", () => {});
        db.run("ALTER TABLE alumni_profiles ADD COLUMN address TEXT;", () => {});
        db.run("ALTER TABLE alumni_profiles ADD COLUMN college TEXT;", () => {});
        db.run(`CREATE TABLE IF NOT EXISTS hods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, designation TEXT NOT NULL DEFAULT '', photo_url TEXT, college_name TEXT, college_address TEXT, mobile_number TEXT, email TEXT, message TEXT, sort_order INTEGER DEFAULT 0, profile_pdf_url TEXT, profile_pdf_name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`, () => {});
        db.run(`CREATE TABLE IF NOT EXISTS spotlights (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          role TEXT,
          grad TEXT,
          photo TEXT,
          text TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (!err) {
            db.get("SELECT COUNT(*) as count FROM spotlights", (countErr, row) => {
              if (!countErr && row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO spotlights (name, role, grad, photo, text) VALUES (?, ?, ?, ?, ?)");
                stmt.run("John Doe", "Staff Software Engineer at Google", "Class of 2012 (Computer Science)", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80", '"My years at Apex University formed the bedrock of my engineering career. The alumni network opened doors to my first internships, which eventually led me to Google. Serving as a mentor now is my way of giving back."');
                stmt.run("Jane Smith", "Vice President at Goldman Sachs", "Class of 2014 (Business Management)", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80", '"The mentorship and rigorous education I received set me up to tackle the challenges of Wall Street. The community is incredibly supportive, and I am proud to sponsor scholarship funds for future business leaders."');
                stmt.run("Robert Chen", "Senior Architect at Foster + Partners", "Class of 2010 (Architecture)", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80", '"Design is collaborative, and the creative environment at Apex taught me to push boundaries. Reconnecting with alumni in Europe helped establish my career abroad. It is a lifelong community."');
                stmt.finalize();
              }
            });
          }
        });

      }
    });
  } catch (err) {
    console.error('Failed to read schema.sql file:', err.message);
  }
}

// Database helper utilities using Promises
const query = {
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },

  exec(sql) {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

module.exports = {
  db,
  query
};
