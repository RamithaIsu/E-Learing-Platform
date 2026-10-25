import { z } from 'zod';
import { ENROLLMENT_STATUSES, LIMITS } from '../constants.js';
import { objectId, wholeNumber } from './fields.js';

const progressFields = {
  status: z.enum(ENROLLMENT_STATUSES, { error: 'Select a status' }),
  progress: wholeNumber('Progress', LIMITS.progress),
};

// A learner can only be marked as completed once they have finished every lesson.
const isCompletionConsistent = ({ status, progress }) =>
  status !== 'Completed' || progress === LIMITS.progress.max;
const completionRule = {
  message: 'A completed enrollment must have 100% progress',
  path: ['progress'],
};

export const enrollmentCreateSchema = z
  .strictObject({
    student: objectId('a student'),
    course: objectId('a course'),
    ...progressFields,
  })
  .refine(isCompletionConsistent, completionRule);

/** Student and course are fixed once enrolled; only progress can change. */
export const enrollmentUpdateSchema = z
  .strictObject(progressFields)
  .refine(isCompletionConsistent, completionRule);
