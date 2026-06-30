const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'alumni.db');
const pgUrl = process.argv[2] || process.env.DATABASE_URL;

if (!pgUrl) {
  console.error('Error: Please provide the Neon PostgreSQL connection string.');
  console.error('Usage: node sync.js "postgresql://user:pass@host/dbname"');
  process.exit(1);
}

const sqliteDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err.message);
    process.exit(1);
  }
  console.log('Opened SQLite database.');
  runMigration();
});

async function runMigration() {
  const pgClient = new Client({
    connectionString: pgUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    console.log('Connected to Neon PostgreSQL database.');

    // 1. Apply PostgreSQL schema first to ensure clean table layouts
    console.log('Applying PostgreSQL schema structure...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pgClient.query(schema);
    console.log('PostgreSQL schema verified/applied.');

    // Table list in safe FK dependency order
    const tables = [
      'settings',
      'users',
      'alumni_profiles',
      'student_profiles',
      'events',
      'event_registrations',
      'jobs',
      'job_applications',
      'mentorships',
      'donations',
      'news',
      'custom_pages',
      'courses',
      'circulars',
      'ncte_disclosures',
      'committee_members',
      'directors',
      'admission_files',
      'hods',
      'gallery',
      'placement_content',
      'placement_companies',
      'spotlights',
      'slider_slides',
      'admissions'
    ];

    // Truncate tables (reverse order to respect FK dependencies)
    console.log('Clearing remote PostgreSQL database tables...');
    for (let i = tables.length - 1; i >= 0; i--) {
      const table = tables[i];
      try {
        await pgClient.query(`TRUNCATE TABLE ${table} CASCADE`);
      } catch (err) {
        // Safe check
      }
    }
    console.log('Remote database tables cleared.');

    // Move data table by table
    for (const table of tables) {
      console.log(`Migrating table data: ${table}...`);
      const rows = await getSqliteRows(table);
      if (rows.length === 0) {
        console.log(`Table ${table} is empty. Skipping.`);
        continue;
      }

      const columns = Object.keys(rows[0]);
      const columnsList = columns.join(', ');
      
      for (const row of rows) {
        const values = columns.map(col => row[col]);
        const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
        const insertQuery = `INSERT INTO ${table} (${columnsList}) VALUES (${placeholders})`;
        await pgClient.query(insertQuery, values);
      }
      console.log(`Migrated ${rows.length} rows for ${table}.`);
    }

    // Reset sequences for auto-increment integrity
    console.log('Synchronizing PostgreSQL serial sequences...');
    const serialTables = [
      'users', 'events', 'event_registrations', 'jobs', 'job_applications', 'mentorships', 
      'donations', 'news', 'courses', 'circulars', 'ncte_disclosures', 'committee_members', 
      'directors', 'admission_files', 'hods', 'gallery', 'placement_content', 
      'placement_companies', 'spotlights', 'slider_slides', 'admissions'
    ];

    for (const table of serialTables) {
      try {
        await pgClient.query(`
          SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM ${table}
        `);
      } catch (err) {
        // Safe capture for tables without standard sequences
      }
    }

    console.log('Migration completed successfully! SQLite database is now fully synced to Neon PostgreSQL.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    sqliteDb.close();
    await pgClient.end();
  }
}

function getSqliteRows(table) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
