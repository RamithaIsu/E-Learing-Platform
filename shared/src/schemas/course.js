import { z } from 'zod';
import { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_STATUSES, LIMITS } from '../constants.js';
import { objectId, requiredText, wholeNumber } from './fields.js';

const COURSE_CODE_PATTERN = /^[A-Z]{2,4}\d{3}$/;

export const lessonSchema = z.strictObject({
  title: requiredText('Lesson title', LIMITS.lessonTitle),
  durationMinutes: wholeNumber('Duration', LIMITS.lessonMinutes),
});

export const courseSchema = z.strictObject({
  title: requiredText('Title', LIMITS.courseTitle),
  code: z
    .string({ error: 'Course code is required' })
    .trim()
    .toUpperCase()
    .min(1, 'Course code is required')
    .regex(COURSE_CODE_PATTERN, 'Use 2-4 letters followed by 3 digits, e.g. WEB101'),
  description: requiredText('Description', LIMITS.courseDescription),
  category: z.enum(COURSE_CATEGORIES, { error: 'Select a category' }),
  level: z.enum(COURSE_LEVELS, { error: 'Select a level' }),
  status: z.enum(COURSE_STATUSES, { error: 'Select a status' }),
  instructor: objectId('an instructor'),
  price: wholeNumber('Price', LIMITS.price),
  capacity: wholeNumber('Capacity', LIMITS.capacity),
  lessons: z
    .array(lessonSchema, { error: 'Add at least one lesson' })
    .min(LIMITS.lessons.min, 'Add at least one lesson')
    .max(LIMITS.lessons.max, `A course can have at most ${LIMITS.lessons.max} lessons`),
});
