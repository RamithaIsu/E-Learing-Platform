import { model, Schema } from 'mongoose';
import { ENROLLMENT_STATUSES, LIMITS } from '@learnsphere/shared';

const enrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, required: true, enum: ENROLLMENT_STATUSES, default: 'Active' },
    progress: {
      type: Number,
      required: true,
      min: LIMITS.progress.min,
      max: LIMITS.progress.max,
      default: 0,
      validate: { validator: Number.isInteger, message: 'Progress must be a whole number' },
    },
    enrolledAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

// A student can enroll in the same course only once (this index also serves "by student" lookups).
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ course: 1, status: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

export const Enrollment = model('Enrollment', enrollmentSchema);
