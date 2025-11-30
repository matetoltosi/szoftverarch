// index.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const { loadUser } = require('./middleware/auth');

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-system';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// view engine
app.set('view engine', 'ejs');

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// static files
app.use(express.static('static'));

// session
app.use(
  session({
    secret: 'change-this-secret',
    resave: false,
    saveUninitialized: false
  })
);

// load current user from session (if any)
app.use(loadUser);

// routes
require('./route/index')(app);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
