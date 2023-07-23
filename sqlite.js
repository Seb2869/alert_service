import sqlite3 from "sqlite3";


function openDatabase(dbName) {
  return new sqlite3.Database(dbName, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to the database:', dbName);
    }
  });
}


function runQuery(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        console.error('Error executing query:', err.message);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}


function getRows(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error fetching rows:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}


function closeDatabase(db) {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}

export { openDatabase, runQuery, getRows, closeDatabase };