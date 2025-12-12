const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const { loadUser } = require('./middleware/auth');

const app = express();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-system';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Parse JSON + urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);

app.use(loadUser);

app.use('/static', express.static('static'));
app.use('/statics', express.static('statics'));


require('./route/index')(app);

app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: 'INTERNAL_ERROR',
    message: err.message
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
