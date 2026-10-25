import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import supertest from 'supertest';
import { afterAll, beforeAll, beforeEach } from 'vitest';
import { createApp } from '../src/app.js';

/**
 * Starts an in-memory replica set (transactions need one), clears data between tests
 * and returns a supertest agent for the app.
 */
export function useTestApi() {
  let replSet;
  const context = {};

  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replSet.getUri());
    await Promise.all(Object.values(mongoose.models).map((Model) => Model.init()));
    context.api = supertest(createApp({ corsOrigins: ['http://localhost:5173'] }));
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.models).map((Model) => Model.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await replSet?.stop();
  });

  return context;
}

export const instructorInput = (overrides = {}) => ({
  fullName: 'Nadeesha Perera',
  email: 'nadeesha@example.com',
  phone: '0771234567',
  expertise: 'Web development',
  ...overrides,
});

export const courseInput = (instructor, overrides = {}) => ({
  title: 'Modern Web Development',
  code: 'WEB101',
  description: 'Build full-stack applications with MongoDB, Express, React and Node.',
  category: 'Programming',
  level: 'Beginner',
  status: 'Published',
  instructor,
  price: 4500,
  capacity: 2,
  lessons: [{ title: 'Introduction', durationMinutes: 45 }],
  ...overrides,
});

export const studentInput = (overrides = {}) => ({
  fullName: 'Kavindi Silva',
  email: 'kavindi@example.com',
  phone: '0761122334',
  dateOfBirth: '2003-04-12',
  ...overrides,
});

export async function createInstructor(api, overrides) {
  return (await api.post('/api/instructors').send(instructorInput(overrides)).expect(201)).body
    .data;
}

export async function createCourse(api, instructorId, overrides) {
  return (await api.post('/api/courses').send(courseInput(instructorId, overrides)).expect(201))
    .body.data;
}

export async function createStudent(api, overrides) {
  return (await api.post('/api/students').send(studentInput(overrides)).expect(201)).body.data;
}

export async function createEnrollment(api, student, course, overrides) {
  const body = { student, course, status: 'Active', progress: 0, ...overrides };
  return (await api.post('/api/enrollments').send(body).expect(201)).body.data;
}
