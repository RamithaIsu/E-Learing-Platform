import { z } from 'zod';
import {
  ENROLLMENT_STATUSES,
  enrollmentCreateSchema,
  enrollmentUpdateSchema,
} from '@learnsphere/shared';
import { crudRouter } from '../../lib/crud-router.js';
import { listQuerySchema, objectIdFilter } from '../../lib/list-query.js';
import { enrollmentService } from './enrollment.service.js';

const listQuery = listQuerySchema({
  sortFields: ['enrolledAt', 'progress'],
  defaultSort: 'enrolledAt',
  defaultOrder: 'desc',
  filters: {
    status: z.enum(ENROLLMENT_STATUSES).optional(),
    course: objectIdFilter.optional(),
    student: objectIdFilter.optional(),
  },
});

export const enrollmentRouter = crudRouter({
  service: enrollmentService,
  listQuery,
  createSchema: enrollmentCreateSchema,
  updateSchema: enrollmentUpdateSchema,
});
