import { model, Schema } from 'mongoose';
import { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_STATUSES, LIMITS } from '@learnsphere/shared';

const integer = { validator: Number.isInteger, message: '{PATH} must be a whole number' };

// Lessons are embedded: they are always read with their course and never shared between courses.
const lessonSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: LIMITS.lessonTitle.max },
    durationMinutes: {
      type: Number,
      required: true,
      min: LIMITS.lessonMinutes.min,
      max: LIMITS.lessonMinutes.max,
      validate: integer,
    },
  },
  { _id: false },
);

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: LIMITS.courseTitle.max },
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: LIMITS.courseDescription.max,
    },
    category: { type: String, required: true, enum: COURSE_CATEGORIES },
    level: { type: String, required: true, enum: COURSE_LEVELS },
    status: { type: String, required: true, enum: COURSE_STATUSES, default: 'Draft' },
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },
    price: {
      type: Number,
      required: true,
      min: LIMITS.price.min,
      max: LIMITS.price.max,
      validate: integer,
    },
    capacity: {
      type: Number,
      required: true,
      min: LIMITS.capacity.min,
      max: LIMITS.capacity.max,
      validate: integer,
    },
    lessons: {
      type: [lessonSchema],
      validate: {
        validator: (lessons) =>
          lessons.length >= LIMITS.lessons.min && lessons.length <= LIMITS.lessons.max,
        message: `A course needs ${LIMITS.lessons.min}-${LIMITS.lessons.max} lessons`,
      },
    },
  },
  { timestamps: true, versionKey: false },
);

courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1, level: 1, status: 1 });
courseSchema.index({ title: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ createdAt: -1 });

export const Course = model('Course', courseSchema);
