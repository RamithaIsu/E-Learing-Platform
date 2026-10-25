import { pluralize } from '../../lib/format';
import { students } from '../../lib/resources';

/** Delete settings for a student; their enrollments are removed with them. */
export const studentDeleteProps = (student) => ({
  resource: students,
  id: student._id,
  entityLabel: 'Student',
  name: student.fullName,
  description: student.enrollmentCount
    ? `${student.fullName} and their ${pluralize(student.enrollmentCount, 'enrollment')} will be permanently removed. This cannot be undone.`
    : `${student.fullName} will be permanently removed. This cannot be undone.`,
});
