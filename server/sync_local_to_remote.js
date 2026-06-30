/**
 * sync_local_to_remote.js
 * Reads all data from local alumni.db (SQLite) and upserts it into the remote Neon PostgreSQL database.
 * Skips tables that don't exist in remote or have no meaningful data.
 */

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

const sqliteDb = new sqlite3.Database(path.join(__dirname, 'alumni.db'), (err) => {
  if (err) { console.error('SQLite open error:', err.message); process.exit(1); }
});

// Tables to sync and their conflict/primary key targets
const tablesToSync = [
  { name: 'settings',           key: 'id' },
  { name: 'users',              key: 'id' },
  { name: 'alumni_profiles',    key: 'user_id' },
  { name: 'student_profiles',   key: 'user_id' },
  { name: 'events',             key: 'id' },
  { name: 'event_registrations',key: 'id',  uniqueKey: '(event_id, user_id)' },
  { name: 'jobs',               key: 'id' },
  { name: 'job_applications',   key: 'id',  uniqueKey: '(job_id, user_id)' },
  { name: 'mentorships',        key: 'id',  uniqueKey: '(mentor_id, mentee_id)' },
  { name: 'donations',          key: 'id' },
  { name: 'news',               key: 'id' },
  { name: 'custom_pages',       key: 'id' },
  { name: 'courses',            key: 'id' },
  { name: 'circulars',          key: 'id' },
  { name: 'ncte_disclosures',   key: 'id' },
  { name: 'committee_members',  key: 'id' },
  { name: 'directors',          key: 'id' },
  { name: 'admission_files',    key: 'id' },
  { name: 'hods',               key: 'id' },
  { name: 'gallery',            key: 'id' },
  { name: 'placement_content',  key: 'id' },
  { name: 'placement_companies',key: 'id' },
  { name: 'spotlights',         key: 'id' },
  { name: 'slider_slides',      key: 'id' },
  { name: 'admissions',         key: 'id' },
  { name: 'results',            key: 'id' },
];

function readSQLiteTable(tableName) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(`SELECT * FROM "${tableName}"`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function upsertRows(tableName, key, uniqueKey, rows) {
  if (!rows || rows.length === 0) {
    console.log(`  [SKIP] ${tableName} — no local rows`);
    return;
  }

  let inserted = 0, failed = 0;
  for (const row of rows) {
    const columns = Object.keys(row);
    const values  = Object.values(row);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const colList = columns.map(c => `"${c}"`).join(', ');

    // Build ON CONFLICT clause
    const conflictTarget = uniqueKey || `(${key})`;
    const updateCols = columns
      .filter(c => c !== key && (key === 'user_id' ? c !== 'user_id' : true))
      .map(c => `"${c}" = EXCLUDED."${c}"`);
    
    let sql;
    if (tableName === 'settings') {
      // settings uses a fixed id=1, just UPDATE everything
      const setCols = columns.filter(c => c !== 'id').map(c => `"${c}" = EXCLUDED."${c}"`);
      sql = `INSERT INTO "${tableName}" (${colList}) VALUES (${placeholders})
             ON CONFLICT (id) DO UPDATE SET ${setCols.join(', ')}`;
    } else if (uniqueKey) {
      sql = `INSERT INTO "${tableName}" (${colList}) VALUES (${placeholders})
             ON CONFLICT ${conflictTarget} DO NOTHING`;
    } else {
      sql = `INSERT INTO "${tableName}" (${colList}) VALUES (${placeholders})
             ON CONFLICT ${conflictTarget} DO UPDATE SET ${updateCols.join(', ')}`;
    }

    try {
      await pool.query(sql, values);
      inserted++;
    } catch (err) {
      console.warn(`  [WARN] ${tableName} row failed: ${err.message.split('\n')[0]}`);
      failed++;
    }
  }
  console.log(`  [OK] ${tableName}: ${inserted} upserted, ${failed} failed`);
}

async function resetSequence(tableName, key) {
  if (key !== 'id') return; // Only reset SERIAL sequences on 'id' columns
  try {
    await pool.query(`SELECT setval(pg_get_serial_sequence('"${tableName}"', '${key}'), COALESCE(MAX(${key}), 1)) FROM "${tableName}"`);
  } catch (e) {
    // Table might not have a sequence (e.g., settings with plain INTEGER pk)
  }
}

async function main() {
  console.log('=== Syncing local SQLite → Remote Neon PostgreSQL ===\n');

  for (const { name, key, uniqueKey } of tablesToSync) {
    try {
      console.log(`Processing: ${name}`);
      const rows = await readSQLiteTable(name);
      await upsertRows(name, key, uniqueKey, rows);
      await resetSequence(name, key);
    } catch (err) {
      if (err.message && err.message.includes('no such table')) {
        console.log(`  [SKIP] ${name} — table not found in local SQLite`);
      } else {
        console.error(`  [ERROR] ${name}: ${err.message}`);
      }
    }
  }

  console.log('\n=== Sync complete! ===');
  sqliteDb.close();
  await pool.end();
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  sqliteDb.close();
  pool.end();
  process.exit(1);
});
