import { z } from 'zod';
import { LIMITS, OBJECT_ID_PATTERN } from '../constants.js';

const NAME_PATTERN = /^\p{L}[\p{L} .'-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Sri Lankan mobile numbers: 07XXXXXXXX or +947XXXXXXXX.
const SL_MOBILE_PATTERN = /^(?:\+94|0)7\d{8}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Required, trimmed text with friendly length messages. */
export const requiredText = (label, { min = 1, max }) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`);

export const fullName = requiredText('Full name', LIMITS.name).regex(
  NAME_PATTERN,
  'Use letters, spaces, dots, hyphens or apostrophes only',
);

export const email = z
  .string({ error: 'Email is required' })
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .max(LIMITS.email.max, `Email must be at most ${LIMITS.email.max} characters`)
  .regex(EMAIL_PATTERN, 'Enter a valid email address, e.g. name@example.com');

export const phone = z
  .string({ error: 'Phone number is required' })
  .trim()
  .min(1, 'Phone number is required')
  .regex(SL_MOBILE_PATTERN, 'Enter a valid mobile number, e.g. 0771234567 or +94771234567');

/** A reference to another document, chosen from a dropdown. */
export const objectId = (label) =>
  z.string({ error: `Select ${label}` }).regex(OBJECT_ID_PATTERN, `Select ${label}`);

/** A whole number within a range; NaN from an empty number input reads as "required". */
export const wholeNumber = (label, { min, max }) =>
  z
    .number({ error: `${label} is required` })
    .int(`${label} must be a whole number`)
    .min(min, `${label} must be at least ${min}`)
    .max(max, `${label} must be at most ${max}`);

/** Whole years between a YYYY-MM-DD date and today (UTC). */
export function calculateAge(isoDate, today = new Date()) {
  const birth = new Date(isoDate);
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday =
    today.getUTCMonth() < birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

const isRealDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

export const dateOfBirth = z
  .string({ error: 'Date of birth is required' })
  .min(1, 'Date of birth is required')
  .regex(ISO_DATE_PATTERN, 'Enter a valid date')
  .refine(isRealDate, 'Enter a valid date')
  .refine((value) => {
    const age = calculateAge(value);
    return age >= LIMITS.studentAge.min && age <= LIMITS.studentAge.max;
  }, `Students must be between ${LIMITS.studentAge.min} and ${LIMITS.studentAge.max} years old`);
