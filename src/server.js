const express = require('express');
const session = require('express-session');
const path = require('path');

const connectMongo = require('./data_access/mongo');

const authController = require('./presentation/api/auth_controller');

const studentCourseController = require('./presentation/api/student_course_controller');
const studentExamController = require('./presentation/api/student_exam_controller');
const studentDocumentController = require('./presentation/api/student_document_controller');
const studentFeeController = require('./presentation/api/student_fee_controller');

const teacherSubjectController = require('./presentation/api/teacher_subject_controller');
const teacherCourseController = require('./presentation/api/teacher_course_controller');
const teacherExamController = require('./presentation/api/teacher_exam_controller');

const adminSubjectController = require('./presentation/api/admin_subject_controller');
const adminDocumentController = require('./presentation/api/admin_document_controller');
const adminFeeController = require('./presentation/api/admin_fee_controller');

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

app.use('/api/student', studentCourseController);
app.use('/api/student', studentExamController);
app.use('/api/student', studentDocumentController);
app.use('/api/student', studentFeeController);

app.use('/api/teacher', teacherSubjectController);
app.use('/api/teacher', teacherCourseController);
app.use('/api/teacher', teacherExamController);

app.use('/api/admin', adminSubjectController);
app.use('/api/admin', adminDocumentController);
app.use('/api/admin', adminFeeController);

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
