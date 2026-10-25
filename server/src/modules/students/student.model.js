import { model, Schema } from 'mongoose';
import { LIMITS } from '@learnsphere/shared';

const studentSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: LIMITS.name.max },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: LIMITS.email.max,
      unique: true,
    },
    phone: { type: String, required: true, trim: true },
    // The API accepts YYYY-MM-DD, which is stored as midnight UTC so the day never shifts.
    dateOfBirth: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

studentSchema.index({ fullName: 1 });
studentSchema.index({ createdAt: -1 });

export const Student = model('Student', studentSchema);
