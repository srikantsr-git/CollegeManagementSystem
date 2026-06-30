const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const base64Regex = /^data:([^;]+);base64,(.+)$/;

function processValue(val) {
  if (typeof val !== 'string') return val;

  const match = val.match(base64Regex);
  if (match) {
    const mimeType = match[1];
    const base64Data = match[2];
    
    let ext = 'bin';
    if (mimeType.includes('image/png')) ext = 'png';
    else if (mimeType.includes('image/jpeg') || mimeType.includes('image/jpg')) ext = 'jpg';
    else if (mimeType.includes('image/gif')) ext = 'gif';
    else if (mimeType.includes('image/svg+xml')) ext = 'svg';
    else if (mimeType.includes('application/pdf')) ext = 'pdf';
    else if (mimeType.includes('application/msword')) ext = 'doc';
    else if (mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) ext = 'docx';
    else if (mimeType.includes('application/vnd.ms-excel')) ext = 'xls';
    else if (mimeType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) ext = 'xlsx';
    else {
      const parts = mimeType.split('/');
      if (parts.length > 1) ext = parts[1].split('+')[0];
    }
    
    const hash = crypto.createHash('md5').update(base64Data).digest('hex');
    const filename = `file_${hash}_${Date.now().toString().slice(-4)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    
    try {
      fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
      console.log(`Saved file to disk: /uploads/${filename} (${fs.statSync(filepath).size} bytes)`);
      return `/uploads/${filename}`;
    } catch (err) {
      console.error(`Failed to save base64 to file:`, err.message);
      return val;
    }
  }

  // Check JSON
  if ((val.startsWith('[') && val.endsWith(']')) || (val.startsWith('{') && val.endsWith('}'))) {
    try {
      const parsed = JSON.parse(val);
      let changed = false;
      
      function traverseAndReplace(obj) {
        if (typeof obj !== 'object' || obj === null) return;
        
        for (let key in obj) {
          if (typeof obj[key] === 'string') {
            const m = obj[key].match(base64Regex);
            if (m) {
              const mime = m[1];
              const data = m[2];
              let ext = 'bin';
              if (mime.includes('image/png')) ext = 'png';
              else if (mime.includes('image/jpeg') || mime.includes('image/jpg')) ext = 'jpg';
              else if (mime.includes('image/gif')) ext = 'gif';
              else if (mime.includes('image/svg+xml')) ext = 'svg';
              else if (mime.includes('application/pdf')) ext = 'pdf';
              
              const hash = crypto.createHash('md5').update(data).digest('hex');
              const filename = `file_${hash}_${Date.now().toString().slice(-4)}.${ext}`;
              const filepath = path.join(uploadsDir, filename);
              try {
                fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
                obj[key] = `/uploads/${filename}`;
                changed = true;
                console.log(`Saved JSON nested file to disk: /uploads/${filename}`);
              } catch (err) {
                console.error(`Failed to save nested base64 to file:`, err.message);
              }
            }
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            traverseAndReplace(obj[key]);
          }
        }
      }
      
      traverseAndReplace(parsed);
      if (changed) {
        return JSON.stringify(parsed);
      }
    } catch (e) {
      // Not valid JSON
    }
  }

  return val;
}

function processParams(params) {
  if (!params || !Array.isArray(params)) return params;
  return params.map(processValue);
}

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
    admissions: 'id',
    results: 'id'
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
      actualParams = processParams(actualParams);
      const pgSql = convertSql(sql);
      pool.query(pgSql, actualParams)
        .then(() => { if (actualCallback) actualCallback(null); })
        .catch(err => { console.error('db.run error:', err.message); if (actualCallback) actualCallback(err); });
    },
    get(sql, params, callback) {
      let actualParams = params; let actualCallback = callback;
      if (typeof params === 'function') { actualCallback = params; actualParams = []; }
      actualParams = processParams(actualParams);
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
      actualParams = processParams(actualParams);
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
          actualParams = processParams(actualParams);
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
      const processed = processParams(params);
      const pgSql = convertSql(sql);
      const res = await pool.query(pgSql, processed);
      const row = res.rows[0];
      if (row && row.count !== undefined) {
        row['COUNT(*)'] = parseInt(row.count, 10);
        row.cnt = parseInt(row.count, 10);
        row.count = parseInt(row.count, 10);
      }
      return row;
    },
    async all(sql, params = []) {
      const processed = processParams(params);
      const pgSql = convertSql(sql);
      const res = await pool.query(pgSql, processed);
      return res.rows;
    },
    async run(sql, params = []) {
      const processed = processParams(params);
      let pgSql = convertSql(sql);
      const isInsert = /^\s*INSERT\s+/i.test(pgSql);
      if (isInsert && !/RETURNING/i.test(pgSql)) {
        const isProfileInsert = /alumni_profiles|student_profiles/i.test(pgSql);
        if (!isProfileInsert) pgSql += ' RETURNING id';
      }
      const res = await pool.query(pgSql, processed);
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

  db = {
    serialize(callback) { sqliteDb.serialize(callback); },
    run(sql, params, callback) {
      let actualParams = params; let actualCallback = callback;
      if (typeof params === 'function') { actualCallback = params; actualParams = []; }
      actualParams = processParams(actualParams);
      sqliteDb.run(sql, actualParams, actualCallback);
    },
    get(sql, params, callback) {
      let actualParams = params; let actualCallback = callback;
      if (typeof params === 'function') { actualCallback = params; actualParams = []; }
      actualParams = processParams(actualParams);
      sqliteDb.get(sql, actualParams, actualCallback);
    },
    all(sql, params, callback) {
      let actualParams = params; let actualCallback = callback;
      if (typeof params === 'function') { actualCallback = params; actualParams = []; }
      actualParams = processParams(actualParams);
      sqliteDb.all(sql, actualParams, actualCallback);
    },
    exec(sql, callback) {
      sqliteDb.exec(sql, callback);
    },
    prepare(sql, callback) {
      const stmt = sqliteDb.prepare(sql, (err) => {
        if (err && callback) callback(err);
      });
      const wrappedStmt = {
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
          actualParams = processParams(actualParams);
          stmt.run(actualParams, actualCallback);
          return wrappedStmt;
        },
        finalize(cb) {
          stmt.finalize(cb);
        }
      };
      if (callback) callback(null, wrappedStmt);
      return wrappedStmt;
    }
  };

  query = {
    get(sql, params = []) {
      const processed = processParams(params);
      return new Promise((resolve, reject) => {
        sqliteDb.get(sql, processed, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    all(sql, params = []) {
      const processed = processParams(params);
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, processed, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    run(sql, params = []) {
      const processed = processParams(params);
      return new Promise((resolve, reject) => {
        sqliteDb.run(sql, processed, function (err) {
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
