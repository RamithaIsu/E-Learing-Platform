import { APP_CONFIG } from '../../config/app';
import { instructors } from '../../lib/resources';

// shortcut: loads up to 100 instructors for dropdowns; switch to a searchable combobox beyond that.
export function useInstructorOptions() {
  const { data, isPending } = instructors.useList({
    limit: APP_CONFIG.pageSize.options,
    sort: 'fullName',
    order: 'asc',
  });
  const options = (data?.data ?? []).map((instructor) => ({
    value: instructor._id,
    label: instructor.fullName,
    description: instructor.expertise,
  }));
  return { options, isPending };
}
