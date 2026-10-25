/**
 * Domain enums and field limits. Both the client forms and the API read these,
 * so a rule changed here changes everywhere at once.
 */

export const COURSE_CATEGORIES = [
  'Programming',
  'Data Science',
  'Design',
  'Business',
  'Languages',
  'Personal Development',
];

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const COURSE_STATUSES = ['Draft', 'Published', 'Archived'];

export const ENROLLMENT_STATUSES = ['Active', 'Completed', 'Dropped'];

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  expertise: { min: 2, max: 100 },
  bio: { max: 500 },
  courseTitle: { min: 3, max: 120 },
  courseDescription: { min: 20, max: 2000 },
  lessonTitle: { min: 3, max: 120 },
  lessonMinutes: { min: 1, max: 600 },
  lessons: { min: 1, max: 30 },
  // Prices are whole Sri Lankan rupees, stored as integers to avoid floating point errors.
  price: { min: 0, max: 1_000_000 },
  capacity: { min: 1, max: 500 },
  progress: { min: 0, max: 100 },
  studentAge: { min: 13, max: 100 },
  search: { max: 100 },
  pageSize: { default: 10, max: 100 },
};

export const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
