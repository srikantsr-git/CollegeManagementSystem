const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'alumni.db'), (err) => {
  if (err) { console.log('alumni.db error:', err.message); return; }
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
    if (err) { console.log('Error:', err.message); return; }
    console.log('=== alumni.db tables ===');
    const tableNames = tables.map(t => t.name);
    console.log(tableNames.join(', '));
    let done = 0;
    tableNames.forEach(tbl => {
      db.get('SELECT COUNT(*) as cnt FROM "' + tbl + '"', [], (err, row) => {
        console.log(tbl + ': ' + (row ? row.cnt : 'error - ' + (err && err.message)));
        done++;
        if (done === tableNames.length) db.close();
      });
    });
  });
});
