import sqlite3 from "sqlite3";


export const openDatabase = (dbName) => {
  return new sqlite3.Database(dbName, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } 
  });
}


export const runQuery = async (db, query, params = []) => {
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


export const getRows = async (db, query, params = []) => {
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

export const closeDatabase = (db) => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } 
  });
}
