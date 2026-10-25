import { describe, expect, it } from 'vitest';
import {
  createCourse,
  createEnrollment,
  createInstructor,
  createStudent,
  instructorInput,
  studentInput,
  useTestApi,
} from './helpers.js';

const ctx = useTestApi();

describe('instructors API', () => {
  it('supports full CRUD with a course count', async () => {
    const instructor = await createInstructor(ctx.api);
    await createCourse(ctx.api, instructor._id);

    const { body: list } = await ctx.api.get('/api/instructors?search=nadeesha').expect(200);
    expect(list.data[0].courseCount).toBe(1);

    const update = instructorInput({ expertise: 'Cloud computing' });
    const { body } = await ctx.api
      .put(`/api/instructors/${instructor._id}`)
      .send(update)
      .expect(200);
    expect(body.data.expertise).toBe('Cloud computing');
  });

  it('blocks deleting an instructor who still teaches courses', async () => {
    const instructor = await createInstructor(ctx.api);
    const course = await createCourse(ctx.api, instructor._id);

    const { body } = await ctx.api.delete(`/api/instructors/${instructor._id}`).expect(409);
    expect(body.error.message).toMatch(/teaches 1 course/);

    await ctx.api.delete(`/api/courses/${course._id}`).expect(204);
    await ctx.api.delete(`/api/instructors/${instructor._id}`).expect(204);
  });

  it('rejects a duplicate email regardless of letter case', async () => {
    await createInstructor(ctx.api);
    const duplicate = instructorInput({ email: 'NADEESHA@example.com' });
    const { body } = await ctx.api.post('/api/instructors').send(duplicate).expect(409);
    expect(body.error.details[0]).toMatchObject({ path: 'email' });
  });
});

describe('students API', () => {
  it('supports full CRUD and stores the date of birth without shifting the day', async () => {
    const student = await createStudent(ctx.api);
    expect(student.dateOfBirth).toBe('2003-04-12T00:00:00.000Z');

    const update = studentInput({ fullName: 'Kavindi Perera' });
    const { body } = await ctx.api.put(`/api/students/${student._id}`).send(update).expect(200);
    expect(body.data.fullName).toBe('Kavindi Perera');

    await ctx.api.delete(`/api/students/${student._id}`).expect(204);
    await ctx.api.get(`/api/students/${student._id}`).expect(404);
  });

  it('deletes a student together with their enrollments', async () => {
    const instructor = await createInstructor(ctx.api);
    const course = await createCourse(ctx.api, instructor._id);
    const student = await createStudent(ctx.api);
    await createEnrollment(ctx.api, student._id, course._id);

    await ctx.api.delete(`/api/students/${student._id}`).expect(204);
    const { body } = await ctx.api.get(`/api/courses/${course._id}`).expect(200);
    expect(body.data.enrollmentCount).toBe(0);
  });
});
