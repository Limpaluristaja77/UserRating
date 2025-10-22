const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Dashboard', 'public')));


const feedbackRouter = require('./Dashboard/routes/feedback');
app.use('/api', feedbackRouter);

app.listen(port, () => {
  console.log(`Server käib aadressil http://localhost:${port}`);
});
