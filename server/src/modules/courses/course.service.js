import mongoose from 'mongoose';
import { notFound, ruleViolation } from '../../lib/http-error.js';
import { countBy, paginate, searchFilter } from '../../lib/list-query.js';
import { Enrollment } from '../enrollments/enrollment.model.js';
import { Instructor } from '../instructors/instructor.model.js';
import { Course } from './course.model.js';

const SEARCH_FIELDS = ['title', 'code'];
const INSTRUCTOR_SUMMARY = { path: 'instructor', select: 'fullName email expertise' };

/** Seats are held by active enrollments only; completed or dropped learners free their seat. */
export const countActiveEnrollments = (courseId) =>
  Enrollment.countDocuments({ course: courseId, status: 'Active' });

async function assertInstructorExists(instructorId) {
  if (!(await Instructor.exists({ _id: instructorId }))) {
    throw ruleViolation('instructor', 'The selected instructor no longer exists');
  }
}

async function list({ search, category, level, status, instructor, ...paging }) {
  const filter = {
    ...searchFilter(search, SEARCH_FIELDS),
    ...(category && { category }),
    ...(level && { level }),
    ...(status && { status }),
    ...(instructor && { instructor }),
  };
  const result = await paginate(Course, filter, paging, INSTRUCTOR_SUMMARY);
  const seatCounts = await countBy(
    Enrollment,
    'course',
    result.data.map((c) => c._id),
    {
      status: 'Active',
    },
  );
  result.data = result.data.map((course) => ({
    ...course,
    activeEnrollmentCount: seatCounts.get(String(course._id)) ?? 0,
  }));
  return result;
}

async function get(id) {
  const course = await Course.findById(id).populate(INSTRUCTOR_SUMMARY).lean();
  if (!course) throw notFound('Course');
  const [activeEnrollmentCount, enrollmentCount] = await Promise.all([
    countActiveEnrollments(id),
    Enrollment.countDocuments({ course: id }),
  ]);
  return { ...course, activeEnrollmentCount, enrollmentCount };
}

async function create(input) {
  await assertInstructorExists(input.instructor);
  return (await Course.create(input)).toObject();
}

async function update(id, input) {
  const [, activeEnrollmentCount] = await Promise.all([
    assertInstructorExists(input.instructor),
    countActiveEnrollments(id),
  ]);
  if (input.capacity < activeEnrollmentCount) {
    throw ruleViolation(
      'capacity',
      `Capacity cannot be lower than the ${activeEnrollmentCount} active enrollment(s)`,
    );
  }
  const course = await Course.findByIdAndUpdate(id, input, {
    returnDocument: 'after',
    runValidators: true,
  }).lean();
  if (!course) throw notFound('Course');
  return course;
}

// Cascade delete inside a transaction so a course and its enrollments disappear together or not at all.
async function remove(id) {
  await mongoose.connection.transaction(async (session) => {
    const course = await Course.findByIdAndDelete(id, { session });
    if (!course) throw notFound('Course');
    await Enrollment.deleteMany({ course: id }, { session });
  });
}

export const courseService = { list, get, create, update, remove };
