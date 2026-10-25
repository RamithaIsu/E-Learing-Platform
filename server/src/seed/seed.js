/**
 * Wipes every collection and inserts a small demo data set (three records per collection).
 * Run with: npm run seed
 */
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { loadEnv } from '../config/env.js';
import { Course } from '../modules/courses/course.model.js';
import { Enrollment } from '../modules/enrollments/enrollment.model.js';
import { Instructor } from '../modules/instructors/instructor.model.js';
import { Student } from '../modules/students/student.model.js';

const MODELS = [Enrollment, Course, Student, Instructor];

const instructors = [
  {
    fullName: 'Dr. Nadeesha Perera',
    email: 'nadeesha.perera@example.com',
    phone: '0771234567',
    expertise: 'Full-stack web development',
    bio: 'Senior lecturer with ten years of experience building production web applications.',
  },
  {
    fullName: 'Kasun Jayawardena',
    email: 'kasun.jayawardena@example.com',
    phone: '0712345678',
    expertise: 'Data science and machine learning',
    bio: 'Data scientist who enjoys turning messy data into clear decisions.',
  },
  {
    fullName: 'Ishara Fernando',
    email: 'ishara.fernando@example.com',
    phone: '+94759876543',
    expertise: 'UI/UX and product design',
    bio: 'Product designer focused on accessible, human-centred interfaces.',
  },
];

const buildCourses = ([web, data, design]) => [
  {
    title: 'Modern Web Development with MERN',
    code: 'WEB101',
    description:
      'Build complete web applications with MongoDB, Express, React and Node.js, from the first route to a deployed app.',
    category: 'Programming',
    level: 'Beginner',
    status: 'Published',
    instructor: web._id,
    price: 4500,
    capacity: 40,
    lessons: [
      { title: 'How the web works', durationMinutes: 45 },
      { title: 'REST APIs with Express', durationMinutes: 90 },
      { title: 'React components and state', durationMinutes: 120 },
    ],
  },
  {
    title: 'Practical Data Science with Python',
    code: 'DSC201',
    description:
      'Clean, explore and model real data sets with pandas and scikit-learn, and present findings clearly.',
    category: 'Data Science',
    level: 'Intermediate',
    status: 'Published',
    instructor: data._id,
    price: 6500,
    capacity: 30,
    lessons: [
      { title: 'Data wrangling with pandas', durationMinutes: 80 },
      { title: 'Visualising data', durationMinutes: 60 },
      { title: 'Your first predictive model', durationMinutes: 100 },
    ],
  },
  {
    title: 'UI/UX Design Fundamentals',
    code: 'UXD110',
    description:
      'Learn user research, wireframing and visual design principles to create interfaces people love to use.',
    category: 'Design',
    level: 'Beginner',
    status: 'Draft',
    instructor: design._id,
    price: 0,
    capacity: 25,
    lessons: [
      { title: 'Understanding your users', durationMinutes: 50 },
      { title: 'Wireframes and prototypes', durationMinutes: 70 },
    ],
  },
];

const students = [
  {
    fullName: 'Kavindi Silva',
    email: 'kavindi.silva@example.com',
    phone: '0761122334',
    dateOfBirth: '2003-04-12',
  },
  {
    fullName: 'Tharindu Bandara',
    email: 'tharindu.bandara@example.com',
    phone: '0703344556',
    dateOfBirth: '2001-11-03',
  },
  {
    fullName: 'Sachini Wickramasinghe',
    email: 'sachini.w@example.com',
    phone: '+94785566778',
    dateOfBirth: '2004-08-25',
  },
];

const buildEnrollments = ([kavindi, tharindu, sachini], [web, data]) => [
  { student: kavindi._id, course: web._id, status: 'Active', progress: 45 },
  { student: tharindu._id, course: web._id, status: 'Completed', progress: 100 },
  { student: sachini._id, course: data._id, status: 'Active', progress: 20 },
];

async function seed() {
  const env = loadEnv();
  await connectDatabase(env.MONGODB_URI);
  try {
    await Promise.all(MODELS.map((Model) => Model.deleteMany({})));
    await Promise.all(MODELS.map((Model) => Model.syncIndexes()));

    const createdInstructors = await Instructor.insertMany(instructors);
    const createdCourses = await Course.insertMany(buildCourses(createdInstructors));
    const createdStudents = await Student.insertMany(students);
    await Enrollment.insertMany(buildEnrollments(createdStudents, createdCourses));

    console.log(`Seeded database "${mongoose.connection.name}":`);
    for (const Model of MODELS) {
      console.log(`  ${Model.collection.name}: ${await Model.countDocuments()}`);
    }
  } finally {
    await disconnectDatabase();
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});
