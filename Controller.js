const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './db.sqlite'; 

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});


const controller = {


  create: ({ rating, name, subject, comment, student_name }, callback) => {
    const sql = `INSERT INTO reviews (rating, name, subject, comment, student_name) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [rating, name, subject, comment, student_name], function(err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID });
    });
  },


  getAll: (callback) => {
    const sql = `SELECT * FROM reviews`;
    db.all(sql, [], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },


  getById: (id, callback) => {
    const sql = `SELECT * FROM reviews WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  },


  update: (id, { rating, name, subject, comment, student_name }, callback) => {
    const sql = `
      UPDATE reviews 
      SET rating = ?, name = ?, subject = ?, comment = ?, student_name = ?
      WHERE id = ?
    `;
    db.run(sql, [rating, name, subject, comment, student_name, id], function(err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  },


  delete: (id, callback) => {
    const sql = `DELETE FROM reviews WHERE id = ?`;
    db.run(sql, [id], function(err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = controller;
