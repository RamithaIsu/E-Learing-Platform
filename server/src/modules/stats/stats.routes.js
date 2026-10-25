import { Router } from 'express';
import { Course } from '../courses/course.model.js';
import { Enrollment } from '../enrollments/enrollment.model.js';
import { Instructor } from '../instructors/instructor.model.js';
import { Student } from '../students/student.model.js';

const RECENT_ENROLLMENTS_LIMIT = 5;

export const statsRouter = Router();

/** Dashboard summary: record counts and the latest enrollments. */
statsRouter.get('/', async (_req, res) => {
  const [courses, publishedCourses, instructors, students, enrollments, activeEnrollments, recent] =
    await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ status: 'Published' }),
      Instructor.countDocuments(),
      Student.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'Active' }),
      Enrollment.find()
        .sort({ enrolledAt: -1 })
        .limit(RECENT_ENROLLMENTS_LIMIT)
        .populate([
          { path: 'student', select: 'fullName' },
          { path: 'course', select: 'title code' },
        ])
        .lean(),
    ]);

  res.json({
    data: {
      counts: { courses, publishedCourses, instructors, students, enrollments, activeEnrollments },
      recentEnrollments: recent,
    },
  });
});
