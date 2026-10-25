import { describe, expect, it } from 'vitest';
import {
  createCourse,
  createEnrollment,
  createInstructor,
  createStudent,
  useTestApi,
} from './helpers.js';

const ctx = useTestApi();

async function setup(courseOverrides) {
  const instructor = await createInstructor(ctx.api);
  const course = await createCourse(ctx.api, instructor._id, courseOverrides);
  const student = await createStudent(ctx.api);
  return { course, student };
}

describe('enrollments API', () => {
  it('creates, lists, updates and deletes an enrollment', async () => {
    const { course, student } = await setup();
    const enrollment = await createEnrollment(ctx.api, student._id, course._id);
    expect(enrollment.student.fullName).toBe(student.fullName);

    const { body: list } = await ctx.api.get(`/api/enrollments?search=web101`).expect(200);
    expect(list.data).toHaveLength(1);

    const { body } = await ctx.api
      .put(`/api/enrollments/${enrollment._id}`)
      .send({ status: 'Completed', progress: 100 })
      .expect(200);
    expect(body.data.status).toBe('Completed');

    await ctx.api.delete(`/api/enrollments/${enrollment._id}`).expect(204);
  });

  it('rejects enrolling the same student twice', async () => {
    const { course, student } = await setup();
    await createEnrollment(ctx.api, student._id, course._id);
    const { body } = await ctx.api
      .post('/api/enrollments')
      .send({ student: student._id, course: course._id, status: 'Active', progress: 0 })
      .expect(409);
    expect(body.error.details[0].path).toBe('course');
  });

  it('only allows enrolling in published courses with free seats', async () => {
    const draft = await setup({ status: 'Draft' });
    const { body: notPublished } = await ctx.api
      .post('/api/enrollments')
      .send({ student: draft.student._id, course: draft.course._id, status: 'Active', progress: 0 })
      .expect(422);
    expect(notPublished.error.message).toMatch(/published/);

    const instructor = await createInstructor(ctx.api, { email: 'other@example.com' });
    const tiny = await createCourse(ctx.api, instructor._id, { code: 'ONE101', capacity: 1 });
    const other = await createStudent(ctx.api, { email: 'other@example.com' });
    await createEnrollment(ctx.api, draft.student._id, tiny._id);
    const { body: full } = await ctx.api
      .post('/api/enrollments')
      .send({ student: other._id, course: tiny._id, status: 'Active', progress: 0 })
      .expect(422);
    expect(full.error.message).toMatch(/full/);
  });

  it('frees a seat when an enrollment is dropped and re-checks capacity on re-activation', async () => {
    const { course, student } = await setup({ capacity: 1 });
    const first = await createEnrollment(ctx.api, student._id, course._id);
    await ctx.api
      .put(`/api/enrollments/${first._id}`)
      .send({ status: 'Dropped', progress: 10 })
      .expect(200);

    const other = await createStudent(ctx.api, { email: 'other@example.com' });
    await createEnrollment(ctx.api, other._id, course._id);
    await ctx.api
      .put(`/api/enrollments/${first._id}`)
      .send({ status: 'Active', progress: 10 })
      .expect(422);
  });

  it('requires 100% progress for a completed enrollment on the server too', async () => {
    const { course, student } = await setup();
    const { body } = await ctx.api
      .post('/api/enrollments')
      .send({ student: student._id, course: course._id, status: 'Completed', progress: 50 })
      .expect(400);
    expect(body.error.details[0].path).toBe('progress');
  });

  it('returns dashboard stats', async () => {
    const { course, student } = await setup();
    await createEnrollment(ctx.api, student._id, course._id);
    const { body } = await ctx.api.get('/api/stats').expect(200);
    expect(body.data.counts).toMatchObject({ courses: 1, students: 1, activeEnrollments: 1 });
    expect(body.data.recentEnrollments).toHaveLength(1);
  });

  it('handles malformed JSON and unknown routes safely', async () => {
    const malformed = await ctx.api
      .post('/api/enrollments')
      .set('Content-Type', 'application/json')
      .send('{bad json')
      .expect(400);
    expect(malformed.body.error.code).toBe('MALFORMED_JSON');
    await ctx.api.get('/api/nothing-here').expect(404);
  });
});
