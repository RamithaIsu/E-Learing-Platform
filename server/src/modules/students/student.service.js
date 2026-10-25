import mongoose from 'mongoose';
import { notFound } from '../../lib/http-error.js';
import { countBy, paginate, searchFilter } from '../../lib/list-query.js';
import { Enrollment } from '../enrollments/enrollment.model.js';
import { Student } from './student.model.js';

const SEARCH_FIELDS = ['fullName', 'email', 'phone'];

async function list({ search, ...paging }) {
  const result = await paginate(Student, searchFilter(search, SEARCH_FIELDS), paging);
  const enrollmentCounts = await countBy(
    Enrollment,
    'student',
    result.data.map((s) => s._id),
  );
  result.data = result.data.map((student) => ({
    ...student,
    enrollmentCount: enrollmentCounts.get(String(student._id)) ?? 0,
  }));
  return result;
}

async function get(id) {
  const student = await Student.findById(id).lean();
  if (!student) throw notFound('Student');
  const enrollmentCount = await Enrollment.countDocuments({ student: id });
  return { ...student, enrollmentCount };
}

async function create(input) {
  return (await Student.create(input)).toObject();
}

async function update(id, input) {
  const student = await Student.findByIdAndUpdate(id, input, {
    returnDocument: 'after',
    runValidators: true,
  }).lean();
  if (!student) throw notFound('Student');
  return student;
}

// Cascade delete inside a transaction: a removed student takes their enrollments with them.
async function remove(id) {
  await mongoose.connection.transaction(async (session) => {
    const student = await Student.findByIdAndDelete(id, { session });
    if (!student) throw notFound('Student');
    await Enrollment.deleteMany({ student: id }, { session });
  });
}

export const studentService = { list, get, create, update, remove };
