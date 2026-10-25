import { conflict, notFound } from '../../lib/http-error.js';
import { countBy, paginate, searchFilter } from '../../lib/list-query.js';
import { Course } from '../courses/course.model.js';
import { Instructor } from './instructor.model.js';

const SEARCH_FIELDS = ['fullName', 'email', 'expertise'];

async function list({ search, ...paging }) {
  const result = await paginate(Instructor, searchFilter(search, SEARCH_FIELDS), paging);
  const courseCounts = await countBy(
    Course,
    'instructor',
    result.data.map((i) => i._id),
  );
  result.data = result.data.map((instructor) => ({
    ...instructor,
    courseCount: courseCounts.get(String(instructor._id)) ?? 0,
  }));
  return result;
}

async function get(id) {
  const instructor = await Instructor.findById(id).lean();
  if (!instructor) throw notFound('Instructor');
  const courseCount = await Course.countDocuments({ instructor: id });
  return { ...instructor, courseCount };
}

async function create(input) {
  return (await Instructor.create(input)).toObject();
}

async function update(id, input) {
  const instructor = await Instructor.findByIdAndUpdate(id, input, {
    returnDocument: 'after',
    runValidators: true,
  }).lean();
  if (!instructor) throw notFound('Instructor');
  return instructor;
}

// Restrict delete: courses must never point at a missing instructor.
async function remove(id) {
  const courseCount = await Course.countDocuments({ instructor: id });
  if (courseCount > 0) {
    throw conflict(
      `This instructor teaches ${courseCount} course(s). Reassign or delete those courses first.`,
    );
  }
  const { deletedCount } = await Instructor.deleteOne({ _id: id });
  if (deletedCount === 0) throw notFound('Instructor');
}

export const instructorService = { list, get, create, update, remove };
