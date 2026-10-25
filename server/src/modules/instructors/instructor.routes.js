import { instructorSchema } from '@learnsphere/shared';
import { crudRouter } from '../../lib/crud-router.js';
import { listQuerySchema } from '../../lib/list-query.js';
import { instructorService } from './instructor.service.js';

const listQuery = listQuerySchema({
  sortFields: ['createdAt', 'fullName'],
  defaultSort: 'fullName',
});

export const instructorRouter = crudRouter({
  service: instructorService,
  listQuery,
  createSchema: instructorSchema,
});
