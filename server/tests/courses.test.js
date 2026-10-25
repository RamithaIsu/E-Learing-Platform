import { describe, expect, it } from 'vitest';
import {
  courseInput,
  createCourse,
  createEnrollment,
  createInstructor,
  createStudent,
  useTestApi,
} from './helpers.js';

const ctx = useTestApi();

describe('courses API', () => {
  it('creates, reads, updates and deletes a course', async () => {
    const instructor = await createInstructor(ctx.api);
    const created = await createCourse(ctx.api, instructor._id, { code: 'web102' });
    expect(created.code).toBe('WEB102');

    const { body: detail } = await ctx.api.get(`/api/courses/${created._id}`).expect(200);
    expect(detail.data.instructor.fullName).toBe(instructor.fullName);
    expect(detail.data.activeEnrollmentCount).toBe(0);

    const update = courseInput(instructor._id, { code: 'WEB102', title: 'Updated title' });
    const { body: updated } = await ctx.api
      .put(`/api/courses/${created._id}`)
      .send(update)
      .expect(200);
    expect(updated.data.title).toBe('Updated title');

    await ctx.api.delete(`/api/courses/${created._id}`).expect(204);
    await ctx.api.get(`/api/courses/${created._id}`).expect(404);
  });

  it('searches, filters, sorts and paginates the list', async () => {
    const instructor = await createInstructor(ctx.api);
    await createCourse(ctx.api, instructor._id, {
      code: 'WEB101',
      title: 'React basics',
      price: 3000,
    });
    await createCourse(ctx.api, instructor._id, {
      code: 'DSC201',
      title: 'Data science',
      category: 'Data Science',
      price: 1000,
    });
    await createCourse(ctx.api, instructor._id, {
      code: 'WEB201',
      title: 'React advanced',
      price: 9000,
    });

    const search = await ctx.api.get('/api/courses?search=react&sort=price&order=desc').expect(200);
    expect(search.body.data.map((c) => c.code)).toEqual(['WEB201', 'WEB101']);

    const filtered = await ctx.api.get('/api/courses?category=Data%20Science').expect(200);
    expect(filtered.body.data).toHaveLength(1);

    const paged = await ctx.api.get('/api/courses?limit=2&page=2&sort=price&order=asc').expect(200);
    expect(paged.body.meta).toMatchObject({ page: 2, total: 3, totalPages: 2 });
    expect(paged.body.data[0].code).toBe('WEB201');
  });

  it('treats search text literally rather than as a regular expression', async () => {
    const instructor = await createInstructor(ctx.api);
    await createCourse(ctx.api, instructor._id);
    const { body } = await ctx.api.get('/api/courses?search=.*').expect(200);
    expect(body.data).toHaveLength(0);
  });

  it('returns field errors for invalid input and rejects unknown query parameters', async () => {
    const { body } = await ctx.api.post('/api/courses').send({ title: 'x' }).expect(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.details.map((d) => d.path)).toEqual(
      expect.arrayContaining(['title', 'code', 'instructor', 'lessons']),
    );
    await ctx.api.get('/api/courses?sort=password').expect(400);
    await ctx.api.get('/api/courses?unknown=1').expect(400);
  });

  it('rejects a duplicate course code and a missing instructor', async () => {
    const instructor = await createInstructor(ctx.api);
    await createCourse(ctx.api, instructor._id);
    const duplicate = await ctx.api
      .post('/api/courses')
      .send(courseInput(instructor._id))
      .expect(409);
    expect(duplicate.body.error.details[0].path).toBe('code');

    const ghost = courseInput('64b7f0c2a1b2c3d4e5f60718', { code: 'NEW101' });
    const missing = await ctx.api.post('/api/courses').send(ghost).expect(422);
    expect(missing.body.error.details[0].path).toBe('instructor');
  });

  it('does not allow capacity below the number of active enrollments', async () => {
    const instructor = await createInstructor(ctx.api);
    const course = await createCourse(ctx.api, instructor._id, { capacity: 2 });
    const [a, b] = await Promise.all([
      createStudent(ctx.api),
      createStudent(ctx.api, { email: 'second@example.com' }),
    ]);
    await createEnrollment(ctx.api, a._id, course._id);
    await createEnrollment(ctx.api, b._id, course._id);

    const update = courseInput(instructor._id, { capacity: 1 });
    const { body } = await ctx.api.put(`/api/courses/${course._id}`).send(update).expect(422);
    expect(body.error.details[0].path).toBe('capacity');
  });

  it('deletes a course together with its enrollments', async () => {
    const instructor = await createInstructor(ctx.api);
    const course = await createCourse(ctx.api, instructor._id);
    const student = await createStudent(ctx.api);
    await createEnrollment(ctx.api, student._id, course._id);

    await ctx.api.delete(`/api/courses/${course._id}`).expect(204);
    const { body } = await ctx.api.get('/api/enrollments').expect(200);
    expect(body.meta.total).toBe(0);
  });

  it('returns 400 for a malformed id and 404 for an unknown one', async () => {
    await ctx.api.get('/api/courses/not-an-id').expect(400);
    await ctx.api.delete('/api/courses/64b7f0c2a1b2c3d4e5f60718').expect(404);
  });
});
