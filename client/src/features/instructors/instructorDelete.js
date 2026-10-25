import { pluralize } from '../../lib/format';
import { instructors } from '../../lib/resources';

/** Delete settings for an instructor; deletion is blocked while they still teach courses. */
export const instructorDeleteProps = (instructor) => ({
  resource: instructors,
  id: instructor._id,
  entityLabel: 'Instructor',
  name: instructor.fullName,
  description: `${instructor.fullName} will be permanently removed. This cannot be undone.`,
  blockedReason: instructor.courseCount
    ? `${instructor.fullName} still teaches ${pluralize(instructor.courseCount, 'course')}. Assign those courses to another instructor or delete them first.`
    : undefined,
});
