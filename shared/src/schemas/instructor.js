import { z } from 'zod';
import { LIMITS } from '../constants.js';
import { email, fullName, phone, requiredText } from './fields.js';

export const instructorSchema = z.strictObject({
  fullName,
  email,
  phone,
  expertise: requiredText('Expertise', LIMITS.expertise),
  bio: z
    .string()
    .trim()
    .max(LIMITS.bio.max, `Bio must be at most ${LIMITS.bio.max} characters`)
    .optional(),
});
