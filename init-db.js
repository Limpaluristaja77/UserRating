const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Dashboard/db/database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    student_name TEXT,
    rating INTEGER CHECK(rating BETWEEN 0 AND 5),
    comment TEXT,
    feedback_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  )`);

  const subjects = ['Matemaatika', 'Eesti keel', 'Inglise keel', 'Bioloogia', 'Ajalugu'];

  subjects.forEach(subject => {
    db.run(`INSERT OR IGNORE INTO subjects (name) VALUES (?)`, [subject]);
  });

  console.log('Andmebaas initsialiseeritud');
});

db.close();
