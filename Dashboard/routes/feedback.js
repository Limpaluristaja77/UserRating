const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Dashboard/db/database.sqlite');

router.get('/subjects', (req, res) => {
  db.all(`SELECT id, name FROM subjects ORDER BY name`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/feedback', (req, res) => {
  const { subject_id, student_name, rating, comment, feedback_type } = req.body;

  if (!subject_id || rating == null) {
    return res.status(400).json({ error: "Õppeaine ID ja hinne on kohustuslikud." });
  }

  const stmt = `INSERT INTO feedback (subject_id, student_name, rating, comment, feedback_type)
                VALUES (?, ?, ?, ?, ?)`;

  db.run(stmt, [subject_id, student_name, rating, comment, feedback_type], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

router.get('/dashboard', (req, res) => {
  const query = `
    SELECT 
      s.name AS subject,
      ROUND(AVG(f.rating), 2) AS average_rating,
      GROUP_CONCAT(f.comment, ' ||| ') AS comments
    FROM feedback f
    JOIN subjects s ON f.subject_id = s.id
    GROUP BY f.subject_id
    ORDER BY average_rating DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
