import { model, Schema } from 'mongoose';
import { LIMITS } from '@learnsphere/shared';

const instructorSchema = new Schema(
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
    expertise: { type: String, required: true, trim: true, maxlength: LIMITS.expertise.max },
    bio: { type: String, trim: true, maxlength: LIMITS.bio.max, default: '' },
  },
  { timestamps: true, versionKey: false },
);

instructorSchema.index({ fullName: 1 });
instructorSchema.index({ createdAt: -1 });

export const Instructor = model('Instructor', instructorSchema);
