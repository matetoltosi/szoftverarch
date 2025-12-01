const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const { loadUser } = require('./middleware/auth');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-system';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
  })
);

app.use(loadUser);

require('./route/index')(app);

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
