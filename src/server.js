const express = require('express');
const session = require('express-session');
const path = require('path');

const connectMongo = require('./data_access/mongo');

const authController = require('./presentation/api/auth_controller');
const adminSubjectController = require('./presentation/api/admin_subject_controller');

const publicRoutes = require('./presentation/routes/public_routes');
const studentRoutes = require('./presentation/routes/student_routes');
const teacherRoutes = require('./presentation/routes/teacher_routes');
const adminRoutes = require('./presentation/routes/admin_routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'dev-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'presentation/views'));
app.use(express.static(path.join(__dirname, 'presentation/static')));

app.use('/api/auth', authController);
app.use('/api/admin', adminSubjectController);

app.use('/', publicRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/admin', adminRoutes);

async function start() {
  await connectMongo();

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

start();
