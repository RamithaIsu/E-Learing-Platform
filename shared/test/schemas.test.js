import { describe, expect, it } from 'vitest';
import {
  calculateAge,
  courseSchema,
  enrollmentCreateSchema,
  enrollmentUpdateSchema,
  instructorSchema,
  studentSchema,
} from '../src/index.js';

const messagesFor = (result, path) =>
  result.error.issues.filter((issue) => issue.path.join('.') === path).map((i) => i.message);

const validCourse = {
  title: 'Modern Web Development',
  code: 'web101',
  description: 'Build full-stack applications with MongoDB, Express, React and Node.',
  category: 'Programming',
  level: 'Beginner',
  status: 'Published',
  instructor: '64b7f0c2a1b2c3d4e5f60718',
  price: 4500,
  capacity: 40,
  lessons: [{ title: 'Introduction', durationMinutes: 45 }],
};

describe('instructorSchema', () => {
  it('normalises email and accepts a valid instructor', () => {
    const result = instructorSchema.parse({
      fullName: '  Nadeesha Perera ',
      email: ' Nadeesha@Example.COM ',
      phone: '0771234567',
      expertise: 'Web development',
    });
    expect(result.fullName).toBe('Nadeesha Perera');
    expect(result.email).toBe('nadeesha@example.com');
  });

  it('rejects bad names, emails, phones and unknown fields', () => {
    const result = instructorSchema.safeParse({
      fullName: 'R2D2',
      email: 'not-an-email',
      phone: '12345',
      expertise: 'x',
      role: 'admin',
    });
    expect(result.success).toBe(false);
    const paths = result.error.issues.map((i) => i.path.join('.') || i.code);
    expect(paths).toEqual(
      expect.arrayContaining(['fullName', 'email', 'phone', 'expertise', 'unrecognized_keys']),
    );
  });
});

describe('courseSchema', () => {
  it('upper-cases the course code', () => {
    expect(courseSchema.parse(validCourse).code).toBe('WEB101');
  });

  it('requires at least one lesson and whole-number money', () => {
    const result = courseSchema.safeParse({ ...validCourse, lessons: [], price: 10.5 });
    expect(messagesFor(result, 'lessons')).toContain('Add at least one lesson');
    expect(messagesFor(result, 'price')).toContain('Price must be a whole number');
  });

  it('treats an empty number input (NaN) as required', () => {
    const result = courseSchema.safeParse({ ...validCourse, capacity: Number.NaN });
    expect(messagesFor(result, 'capacity')).toEqual(['Capacity is required']);
  });

  it('rejects malformed course codes and categories outside the list', () => {
    const result = courseSchema.safeParse({ ...validCourse, code: 'WEB1', category: 'Cooking' });
    expect(messagesFor(result, 'code')).toHaveLength(1);
    expect(messagesFor(result, 'category')).toEqual(['Select a category']);
  });
});

describe('studentSchema', () => {
  const base = { fullName: 'Kavindi Silva', email: 'k@example.com', phone: '+94771234567' };

  it('rejects impossible dates and students younger than 13', () => {
    expect(studentSchema.safeParse({ ...base, dateOfBirth: '2005-02-30' }).success).toBe(false);
    const thisYear = new Date().getUTCFullYear();
    const tooYoung = studentSchema.safeParse({ ...base, dateOfBirth: `${thisYear - 5}-01-01` });
    expect(messagesFor(tooYoung, 'dateOfBirth')[0]).toMatch(/between 13 and 100/);
  });

  it('accepts a valid student', () => {
    expect(studentSchema.safeParse({ ...base, dateOfBirth: '2003-06-15' }).success).toBe(true);
  });
});

describe('calculateAge', () => {
  it('counts a birthday only once it has passed', () => {
    const today = new Date('2026-06-14T00:00:00Z');
    expect(calculateAge('2000-06-15', today)).toBe(25);
    expect(calculateAge('2000-06-14', today)).toBe(26);
  });
});

describe('enrollment schemas', () => {
  const ids = { student: '64b7f0c2a1b2c3d4e5f60718', course: '64b7f0c2a1b2c3d4e5f60719' };

  it('requires 100% progress for a completed enrollment', () => {
    const result = enrollmentCreateSchema.safeParse({ ...ids, status: 'Completed', progress: 80 });
    expect(messagesFor(result, 'progress')).toEqual([
      'A completed enrollment must have 100% progress',
    ]);
  });

  it('does not allow changing the student or course on update', () => {
    const result = enrollmentUpdateSchema.safeParse({ ...ids, status: 'Active', progress: 10 });
    expect(result.success).toBe(false);
  });
});
