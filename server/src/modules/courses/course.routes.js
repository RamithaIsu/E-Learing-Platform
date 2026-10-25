import { z } from 'zod';
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  COURSE_STATUSES,
  courseSchema,
} from '@learnsphere/shared';
import { crudRouter } from '../../lib/crud-router.js';
import { listQuerySchema, objectIdFilter } from '../../lib/list-query.js';
import { courseService } from './course.service.js';

const listQuery = listQuerySchema({
  sortFields: ['createdAt', 'title', 'code', 'price'],
  defaultSort: 'createdAt',
  defaultOrder: 'desc',
  filters: {
    category: z.enum(COURSE_CATEGORIES).optional(),
    level: z.enum(COURSE_LEVELS).optional(),
    status: z.enum(COURSE_STATUSES).optional(),
    instructor: objectIdFilter.optional(),
  },
});

export const courseRouter = crudRouter({
  service: courseService,
  listQuery,
  createSchema: courseSchema,
});
