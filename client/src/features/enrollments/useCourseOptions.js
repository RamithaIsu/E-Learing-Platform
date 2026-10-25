import { APP_CONFIG } from '../../config/app';
import { courses, students } from '../../lib/resources';

const OPTION_QUERY = { limit: APP_CONFIG.pageSize.options, order: 'asc' };

/**
 * Courses as dropdown options. With forEnrollment, only published courses are listed and
 * full ones are disabled, matching the server rules.
 */
// shortcut: loads up to 100 records for dropdowns; switch to a searchable combobox beyond that.
export function useCourseOptions({ forEnrollment = false } = {}) {
  const { data, isPending } = courses.useList({
    ...OPTION_QUERY,
    sort: 'title',
    ...(forEnrollment && { status: 'Published' }),
  });
  const options = (data?.data ?? []).map((course) => {
    const seatsLeft = course.capacity - course.activeEnrollmentCount;
    return {
      value: course._id,
      label: `${course.code} - ${course.title}`,
      description: forEnrollment
        ? seatsLeft > 0
          ? `${seatsLeft} of ${course.capacity} seats left`
          : 'Full'
        : undefined,
      disabled: forEnrollment && seatsLeft <= 0,
    };
  });
  return { options, isPending };
}

export function useStudentOptions() {
  const { data, isPending } = students.useList({ ...OPTION_QUERY, sort: 'fullName' });
  const options = (data?.data ?? []).map((student) => ({
    value: student._id,
    label: student.fullName,
    description: student.email,
  }));
  return { options, isPending };
}
