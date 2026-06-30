const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

let db;
let query;

if (connectionString) {
  console.log('Connecting to Neon PostgreSQL database...');
  const { Pool } = require('pg');
  const schemaPath = path.join(__dirname, 'schema.sql');

  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  let isInitialized = false;

  // Auto-initialize PostgreSQL database schema
  initializePostgresDatabase();

  const conflictTargets = {
    settings: 'id',
    users: 'id',
    alumni_profiles: 'user_id',
    student_profiles: 'user_id',
    events: 'id',
    event_registrations: 'id',
    jobs: 'id',
    job_applications: 'id',
    mentorships: 'id',
    donations: 'id',
    news: 'id',
    custom_pages: 'id',
    courses: 'id',
    circulars: 'id',
    ncte_disclosures: 'id',
    committee_members: 'id',
    directors: 'id',
    admission_files: 'id',
    hods: 'id',
    gallery: 'id',
    placement_content: 'id',
    placement_companies: 'id',
    spotlights: 'id',
    slider_slides: 'id',
    admissions: 'id'
  };

  function convertSql(sql) {
    if (!sql) return sql;
    let pgSql = sql.trim();
    pgSql = pgSql.replace(/;+$/, '');

    if (pgSql.toUpperCase().startsWith('PRAGMA')) {
      return 'SELECT 1';
    }

    pgSql = pgSql.replace(/\bLIKE\b/gi, 'ILIKE');

    let paramIndex = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);

    if (/INSERT\s+OR\s+REPLACE\s+INTO\s+settings/i.test(pgSql)) {
      const colMatch = pgSql.match(/settings\s*\(([^)]+)\)/i);
      if (colMatch) {
        const cols = colMatch[1].split(',').map(s => s.trim().toLowerCase());
        const updates = [];
        for (let i = 1; i < cols.length; i++) {
          updates.push(`${cols[i]} = $${i}`);
        }
        return `UPDATE settings SET ${updates.join(', ')} WHERE id = 1`;
      }
    }

    if (/INSERT\s+OR\s+REPLACE\s+INTO\s+(\w+)/i.test(pgSql)) {
      const match = pgSql.match(/INSERT\s+OR\s+REPLACE\s+INTO\s+(\w+)\s*\(([^)]+)\)/i);
      if (match) {
        const tableName = match[1];
        const columnsStr = match[2];
        const columns = columnsStr.split(',').map(c => c.trim().toLowerCase());
        const target = conflictTargets[tableName.toLowerCase()] || 'id';
        const updates = columns
          .filter(c => c !== target)
          .map(c => `${c} = EXCLUDED.${c}`)
          .join(', ');
        pgSql = pgSql.replace(/INSERT\s+OR\s+REPLACE\s+INTO/i, 'INSERT INTO');
        pgSql += ` ON CONFLICT (${target}) DO UPDATE SET ${updates}`;
        return pgSql;
      }
    }

    const matchIgnore = pgSql.match(/INSERT\s+OR\s+IGNORE\s+INTO\s+(\w+)/i);
    if (matchIgnore) {
      const tableName = matchIgnore[1].toLowerCase();
      let target = conflictTargets[tableName] || 'id';
      if (tableName === 'event_registrations') target = 'event_id, user_id';
      else if (tableName === 'job_applications') target = 'job_id, user_id';
      else if (tableName === 'mentorships') target = 'mentor_id, mentee_id';
      pgSql = pgSql.replace(/INSERT\s+OR\s+IGNORE\s+INTO/i, 'INSERT INTO');
      pgSql += ` ON CONFLICT (${target}) DO NOTHING`;
    }

    pgSql = pgSql.replace(/AUTOINCREMENT/gi, '');
    pgSql = pgSql.replace(/id\s+INTEGER\s+PRIMARY\s+KEY\s*(?:AUTOINCREMENT)?/gi, 'id SERIAL PRIMARY KEY');
    pgSql = pgSql.replace(/id\s+INT\s+PRIMARY\s+KEY\s*(?:AUTOINCREMENT)?/gi, 'id SERIAL PRIMARY KEY');
    pgSql = pgSql.replace(/\bDATETIME\b/gi, 'TIMESTAMP');

    return pgSql;
  }

  db = {
    serialize(callback) { callback(); },
    run(sql, params, callback) {
      let actualParams = params; let actualCallback = callback;
      if (typeof params === 'function') { actualCallback = params; actualParams = []; }
      const pgSql = convertSql(sql);
      pool.query(pgSql, actualParams)
        .then(() => { if (actualCallback) actualCallback(null); })
        .catch(err => { console.error('db.run error:', err.message); if (actualCallback) actualCallback(err); });
    },
    get(sql, params, callback) {
      let actualParams = params; let actualCallback = callback;
      if (typeof params === 'function') { actualCallback = params; actualParams = []; }
      const pgSql = convertSql(sql);
      pool.query(pgSql, actualParams)
        .then(res => {
          const row = res.rows[0];
          if (row && row.count !== undefined) {
            row['COUNT(*)'] = parseInt(row.count, 10);
            row.cnt = parseInt(row.count, 10);
            row.count = parseInt(row.count, 10);
          }
          if (actualCallback) actualCallback(null, row);
        })
        .catch(err => { console.error('db.get error:', err.message); if (actualCallback) actualCallback(err, null); });
    },
    all(sql, params, callback) {
      let actualParams = params; let actualCallback = callback;
      if (typeof params === 'function') { actualCallback = params; actualParams = []; }
      const pgSql = convertSql(sql);
      pool.query(pgSql, actualParams)
        .then(res => { if (actualCallback) actualCallback(null, res.rows); })
        .catch(err => { console.error('db.all error:', err.message); if (actualCallback) actualCallback(err, null); });
    },
    exec(sql, callback) {
      const pgSql = convertSql(sql);
      pool.query(pgSql)
        .then(() => { if (callback) callback(null); })
        .catch(err => { console.error('db.exec error:', err.message); if (callback) callback(err); });
    },
    prepare(sql, callback) {
      const pgSql = convertSql(sql);
      const stmt = {
        run(...args) {
          let actualParams = args;
          let actualCallback = null;
          if (args.length > 0 && typeof args[args.length - 1] === 'function') {
            actualCallback = args[args.length - 1];
            actualParams = args.slice(0, args.length - 1);
          }
          if (actualParams.length === 1 && Array.isArray(actualParams[0])) {
            actualParams = actualParams[0];
          }
          pool.query(pgSql, actualParams)
            .then(() => { if (actualCallback) actualCallback(null); })
            .catch(err => { console.error('stmt.run error:', err.message, 'SQL:', pgSql); if (actualCallback) actualCallback(err); });
        },
        finalize(cb) {
          if (cb) cb(null);
        }
      };
      if (callback) callback(null, stmt);
      return stmt;
    }
  };

  query = {
    async get(sql, params = []) {
      const pgSql = convertSql(sql);
      const res = await pool.query(pgSql, params);
      const row = res.rows[0];
      if (row && row.count !== undefined) {
        row['COUNT(*)'] = parseInt(row.count, 10);
        row.cnt = parseInt(row.count, 10);
        row.count = parseInt(row.count, 10);
      }
      return row;
    },
    async all(sql, params = []) {
      const pgSql = convertSql(sql);
      const res = await pool.query(pgSql, params);
      return res.rows;
    },
    async run(sql, params = []) {
      let pgSql = convertSql(sql);
      const isInsert = /^\s*INSERT\s+/i.test(pgSql);
      if (isInsert && !/RETURNING/i.test(pgSql)) {
        const isProfileInsert = /alumni_profiles|student_profiles/i.test(pgSql);
        if (!isProfileInsert) pgSql += ' RETURNING id';
      }
      const res = await pool.query(pgSql, params);
      const lastRow = res.rows[0];
      return { id: lastRow ? lastRow.id : null, changes: res.rowCount };
    },
    async exec(sql) {
      const pgSql = convertSql(sql);
      await pool.query(pgSql);
    }
  };

  async function initializePostgresDatabase() {
    if (isInitialized) return;
    try {
      console.log('Initializing database schema on Neon PostgreSQL...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      console.log('Database schema verified & seeded successfully.');
      isInitialized = true;
    } catch (err) {
      console.error('Failed database initialization:', err.message);
    }
  }

} else {
  console.log('DATABASE_URL not set. Falling back to local SQLite database...');
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, 'alumni.db');
  
  const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Failed to connect to SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database at:', dbPath);
      sqliteDb.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
        if (pragmaErr) console.error('Failed to enable foreign keys:', pragmaErr.message);
      });
    }
  });

  db = sqliteDb;

  query = {
    get(sql, params = []) {
      return new Promise((resolve, reject) => {
        sqliteDb.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    all(sql, params = []) {
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    run(sql, params = []) {
      return new Promise((resolve, reject) => {
        sqliteDb.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, changes: this.changes });
        });
      });
    },
    exec(sql) {
      return new Promise((resolve, reject) => {
        sqliteDb.exec(sql, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  };
}

module.exports = {
  db,
  query
};
