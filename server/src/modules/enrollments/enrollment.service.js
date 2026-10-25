import { notFound, ruleViolation } from '../../lib/http-error.js';
import { paginate, searchFilter } from '../../lib/list-query.js';
import { countActiveEnrollments } from '../courses/course.service.js';
import { Course } from '../courses/course.model.js';
import { Student } from '../students/student.model.js';
import { Enrollment } from './enrollment.model.js';

const POPULATE = [
  { path: 'student', select: 'fullName email' },
  { path: 'course', select: 'title code status' },
];

/** Search matches the student's name or email, or the course's title or code. */
async function searchByRelations(search) {
  if (!search) return {};
  const [students, courses] = await Promise.all([
    Student.find(searchFilter(search, ['fullName', 'email'])).distinct('_id'),
    Course.find(searchFilter(search, ['title', 'code'])).distinct('_id'),
  ]);
  return { $or: [{ student: { $in: students } }, { course: { $in: courses } }] };
}

async function assertSeatAvailable(course) {
  if ((await countActiveEnrollments(course._id)) >= course.capacity) {
    throw ruleViolation(
      'course',
      'This course is full. Increase its capacity or choose another course.',
    );
  }
}

async function list({ search, status, course, student, ...paging }) {
  const filter = {
    ...(await searchByRelations(search)),
    ...(status && { status }),
    ...(course && { course }),
    ...(student && { student }),
  };
  return paginate(Enrollment, filter, paging, POPULATE);
}

async function get(id) {
  const enrollment = await Enrollment.findById(id).populate(POPULATE).lean();
  if (!enrollment) throw notFound('Enrollment');
  return enrollment;
}

// shortcut: the seat check and insert are not atomic, so two simultaneous enrollments could exceed
// capacity by one; move the check into a transaction if concurrent sign-ups become common.
async function create(input) {
  const [student, course] = await Promise.all([
    Student.exists({ _id: input.student }),
    Course.findById(input.course).lean(),
  ]);
  if (!student) throw ruleViolation('student', 'The selected student no longer exists');
  if (!course) throw ruleViolation('course', 'The selected course no longer exists');
  if (course.status !== 'Published') {
    throw ruleViolation('course', 'Only published courses accept new enrollments');
  }
  if (input.status === 'Active') await assertSeatAvailable(course);

  const enrollment = await Enrollment.create(input);
  return get(enrollment._id);
}

async function update(id, input) {
  const existing = await Enrollment.findById(id).lean();
  if (!existing) throw notFound('Enrollment');

  // Re-activating a completed or dropped enrollment takes a seat again.
  if (input.status === 'Active' && existing.status !== 'Active') {
    const course = await Course.findById(existing.course).lean();
    await assertSeatAvailable(course);
  }
  await Enrollment.updateOne({ _id: id }, input, { runValidators: true });
  return get(id);
}

async function remove(id) {
  const { deletedCount } = await Enrollment.deleteOne({ _id: id });
  if (deletedCount === 0) throw notFound('Enrollment');
}

export const enrollmentService = { list, get, create, update, remove };
