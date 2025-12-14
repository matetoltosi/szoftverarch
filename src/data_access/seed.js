const connectMongo = require('./mongo');
const User = require('./schemas/user_schema');

async function seed() {
  await connectMongo();

  const existing = await User.countDocuments();
  if (existing > 0) {
    console.log('Database already seeded');
    process.exit(0);
  }

  await User.insertMany([
    {
      email: 'student@bme.edu',
      password: 'studentpass',
      name: 'Alíz',
      role: 'student'
    },
    {
      email: 'teacher@bme.edu',
      password: 'teacherpass',
      name: 'Béla',
      role: 'teacher'
    },
    {
      email: 'admin@bme.edu',
      password: 'adminpass',
      name: 'Cecil',
      role: 'admin'
    }
  ]);

  console.log('Database seeded');
  process.exit(0);
}

seed();
