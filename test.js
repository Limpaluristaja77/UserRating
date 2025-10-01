const reviewController = require('./Controller.js');


reviewController.create({
  rating: 5,
  name: 'Test Name',
  subject: 'Math',
  comment: 'Great student',
  student_name: 'John Doe'
}, (err, result) => {
  if (err) return console.error(err);
  console.log('Created new review with ID:', result.id);
});


reviewController.getAll((err, rows) => {
  if (err) return console.error(err);
  console.log(rows);
});