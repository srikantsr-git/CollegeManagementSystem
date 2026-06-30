const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const schemaPath = path.join(__dirname, 'schema.sql');

// Establish PostgreSQL connection pool
// Neon provides DATABASE_URL in the format postgres://...
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : false
});

// Seed flag tracking to prevent repeated seeding runs
let isInitialized = false;

// Auto-initialize the database (runs on startup)
initializeDatabase();

// Conflict targets mapped by table name for Postgres ON CONFLICT clause
const conflictTargets = {
  settings: 'id',
  users: 'id',
  alumni_profiles: 'user_id',
  student_profiles: 'user_id',
  events: 'id',
  event_registrations: 'id', // event_id, user_id also has UNIQUE
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

// SQL Statement Converter
function convertSql(sql) {
  if (!sql) return sql;
  
  let pgSql = sql.trim();
  
  // 1. Remove trailing semicolon if present (to safely append clauses like RETURNING)
  pgSql = pgSql.replace(/;+$/, '');

  // 2. Convert sqlite's PRAGMA statements (ignore or rewrite)
  if (pgSql.toUpperCase().startsWith('PRAGMA')) {
    return 'SELECT 1'; // dummy statement
  }

  // 3. Convert LIKE to ILIKE for case-insensitive matching matching SQLite behavior
  pgSql = pgSql.replace(/\bLIKE\b/gi, 'ILIKE');

  // 4. Convert SQLite placeholders (?) to PostgreSQL ($1, $2...)
  let paramIndex = 1;
  pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);

  // 5. Handle settings table INSERT OR REPLACE
  // Settings only ever has 1 row with id=1, so we convert INSERT OR REPLACE to a standard UPDATE
  if (/INSERT\s+OR\s+REPLACE\s+INTO\s+settings/i.test(pgSql)) {
    const colMatch = pgSql.match(/settings\s*\(([^)]+)\)/i);
    if (colMatch) {
      const cols = colMatch[1].split(',').map(s => s.trim().toLowerCase());
      // Reconstruct: UPDATE settings SET col1 = $1, col2 = $2... WHERE id = 1
      // Since id=1 is hardcoded in the query and not passed in parameters, we start updates list at cols[1]
      const updates = [];
      for (let i = 1; i < cols.length; i++) {
        updates.push(`${cols[i]} = $${i}`);
      }
      return `UPDATE settings SET ${updates.join(', ')} WHERE id = 1`;
    }
  }

  // 6. Convert general INSERT OR REPLACE to ON CONFLICT DO UPDATE
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

  // 7. Convert INSERT OR IGNORE to ON CONFLICT DO NOTHING
  const matchIgnore = pgSql.match(/INSERT\s+OR\s+IGNORE\s+INTO\s+(\w+)/i);
  if (matchIgnore) {
    const tableName = matchIgnore[1].toLowerCase();
    let target = conflictTargets[tableName] || 'id';
    
    // Custom handling for composite unique constraints
    if (tableName === 'event_registrations') {
      target = 'event_id, user_id';
    } else if (tableName === 'job_applications') {
      target = 'job_id, user_id';
    } else if (tableName === 'mentorships') {
      target = 'mentor_id, mentee_id';
    }
    
    pgSql = pgSql.replace(/INSERT\s+OR\s+IGNORE\s+INTO/i, 'INSERT INTO');
    pgSql += ` ON CONFLICT (${target}) DO NOTHING`;
  }

  // 8. Convert SQLite table creation types
  pgSql = pgSql.replace(/AUTOINCREMENT/gi, '');
  pgSql = pgSql.replace(/id\s+INTEGER\s+PRIMARY\s+KEY\s*(?:AUTOINCREMENT)?/gi, 'id SERIAL PRIMARY KEY');
  pgSql = pgSql.replace(/id\s+INT\s+PRIMARY\s+KEY\s*(?:AUTOINCREMENT)?/gi, 'id SERIAL PRIMARY KEY');
  pgSql = pgSql.replace(/\bDATETIME\b/gi, 'TIMESTAMP');

  return pgSql;
}

// Custom mock for SQLite's Database object to avoid rewriting index.js direct queries
const db = {
  serialize(callback) {
    // Simply execute the callback synchronously. The nested callbacks in client queries enforce order naturally.
    callback();
  },

  run(sql, params, callback) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }
    
    const pgSql = convertSql(sql);
    pool.query(pgSql, actualParams)
      .then(res => {
        if (actualCallback) actualCallback(null);
      })
      .catch(err => {
        console.error('db.run error:', err.message, 'SQL:', pgSql);
        if (actualCallback) actualCallback(err);
      });
  },

  get(sql, params, callback) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }
    
    const pgSql = convertSql(sql);
    pool.query(pgSql, actualParams)
      .then(res => {
        const row = res.rows[0];
        // SQLite expects COUNT(*) column aliases to map cleanly
        if (row && row.count !== undefined) {
          row['COUNT(*)'] = parseInt(row.count, 10);
          row.cnt = parseInt(row.count, 10);
          row.count = parseInt(row.count, 10);
        }
        if (actualCallback) actualCallback(null, row);
      })
      .catch(err => {
        console.error('db.get error:', err.message, 'SQL:', pgSql);
        if (actualCallback) actualCallback(err, null);
      });
  },

  all(sql, params, callback) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }
    
    const pgSql = convertSql(sql);
    pool.query(pgSql, actualParams)
      .then(res => {
        if (actualCallback) actualCallback(null, res.rows);
      })
      .catch(err => {
        console.error('db.all error:', err.message, 'SQL:', pgSql);
        if (actualCallback) actualCallback(err, null);
      });
  },

  exec(sql, callback) {
    const pgSql = convertSql(sql);
    pool.query(pgSql)
      .then(() => {
        if (callback) callback(null);
      })
      .catch(err => {
        console.error('db.exec error:', err.message, 'SQL:', pgSql);
        if (callback) callback(err);
      });
  }
};

// Database helper utilities using Promises (used extensively in index.js)
const query = {
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
    
    // Automatically append RETURNING id to INSERT statements where id auto-increments
    if (isInsert && !/RETURNING/i.test(pgSql)) {
      const isProfileInsert = /alumni_profiles|student_profiles/i.test(pgSql);
      if (!isProfileInsert) {
        pgSql += ' RETURNING id';
      }
    }
    
    const res = await pool.query(pgSql, params);
    const lastRow = res.rows[0];
    return {
      id: lastRow ? lastRow.id : null,
      changes: res.rowCount
    };
  },

  async exec(sql) {
    const pgSql = convertSql(sql);
    await pool.query(pgSql);
  }
};

// Run Schema initialization
async function initializeDatabase() {
  if (isInitialized) return;
  try {
    if (!connectionString) {
      console.warn('Warning: DATABASE_URL not set. Skipping DB initialization.');
      return;
    }
    console.log('Initializing database schema on Neon PostgreSQL...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    // Run schema.sql statements
    await pool.query(schema);
    console.log('Database schema verified & seeded successfully.');
    isInitialized = true;
  } catch (err) {
    console.error('Failed database initialization:', err.message);
  }
}

module.exports = {
  db,
  query
};
