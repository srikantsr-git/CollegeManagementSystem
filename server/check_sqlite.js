const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    
    console.log('Tables in SQLite alumni.db:');
    let completed = 0;
    
    tables.forEach(t => {
      db.get(`SELECT COUNT(*) as cnt FROM ${t.name}`, [], (err2, row) => {
        completed++;
        if (err2) {
          console.log(`- ${t.name}: Error: ${err2.message}`);
        } else {
          console.log(`- ${t.name}: ${row.cnt} rows`);
        }
        
        if (completed === tables.length) {
          db.close();
        }
      });
    });
  });
});
