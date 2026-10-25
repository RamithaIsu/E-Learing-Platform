import { studentSchema } from '@learnsphere/shared';
import { crudRouter } from '../../lib/crud-router.js';
import { listQuerySchema } from '../../lib/list-query.js';
import { studentService } from './student.service.js';

const listQuery = listQuerySchema({
  sortFields: ['createdAt', 'fullName', 'dateOfBirth'],
  defaultSort: 'fullName',
});

export const studentRouter = crudRouter({
  service: studentService,
  listQuery,
  createSchema: studentSchema,
});
