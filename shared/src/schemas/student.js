import { z } from 'zod';
import { dateOfBirth, email, fullName, phone } from './fields.js';

export const studentSchema = z.strictObject({
  fullName,
  email,
  phone,
  dateOfBirth,
});
