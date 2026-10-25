import { ClipboardList, Plus } from 'lucide-react';
import { ENROLLMENT_STATUSES } from '@learnsphere/shared';
import { DataTable } from '../../components/data/DataTable';
import {
  FilterSelect,
  ListToolbar,
  SearchInput,
  SortSelect,
} from '../../components/data/ListToolbar';
import { PageHeader } from '../../components/layout/PageHeader';
import { ButtonLink } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { toOptions } from '../../lib/options';
import { EmptyState, ErrorState, LoadingRows } from '../../components/ui/States';
import { APP_CONFIG } from '../../config/app';
import { useListParams } from '../../hooks/useListParams';
import { cn } from '../../lib/cn';
import { enrollments } from '../../lib/resources';
import { useCourseOptions } from './useCourseOptions';
import { enrollmentColumns } from './enrollmentColumns';

const FILTERS = { search: '', status: '', course: '' };
const DEFAULTS = { ...FILTERS, sort: 'enrolledAt', order: 'desc', page: '1' };
const SORT_OPTIONS = [
  { value: 'enrolledAt:desc', label: 'Newest first' },
  { value: 'enrolledAt:asc', label: 'Oldest first' },
  { value: 'progress:desc', label: 'Progress (high to low)' },
  { value: 'progress:asc', label: 'Progress (low to high)' },
];
const COLUMNS = enrollmentColumns();

export default function EnrollmentListPage() {
  const [params, update] = useListParams(DEFAULTS);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = enrollments.useList({
    ...params,
    limit: APP_CONFIG.pageSize.table,
  });
  const courseOptions = useCourseOptions();
  const hasFilters = Object.keys(FILTERS).some((key) => params[key]);

  let content;
  if (isPending) content = <LoadingRows label="Loading enrollments" />;
  else if (isError) content = <ErrorState error={error} onRetry={refetch} />;
  else if (data.data.length === 0) {
    content = hasFilters ? (
      <EmptyState
        title="No enrollments match your filters"
        description="Try a different search term or clear the filters."
      />
    ) : (
      <EmptyState
        icon={ClipboardList}
        title="No enrollments yet"
        description="Enroll a student in a published course to start tracking progress."
        action={
          <ButtonLink to="/enrollments/new">
            <Plus /> Enroll a student
          </ButtonLink>
        }
      />
    );
  } else {
    content = (
      <>
        <div
          aria-busy={isPlaceholderData}
          className={cn('transition-opacity', isPlaceholderData && 'opacity-60')}
        >
          <DataTable caption="Enrollments" columns={COLUMNS} rows={data.data} />
        </div>
        <Pagination meta={data.meta} onPageChange={(page) => update({ page })} noun="enrollments" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Enrollments"
        description="Which students take which courses, and how far they have progressed."
        actions={
          <ButtonLink to="/enrollments/new">
            <Plus /> Enroll a student
          </ButtonLink>
        }
      />
      <Card>
        <ListToolbar
          canClear={hasFilters}
          onClear={() => update(FILTERS)}
          search={
            <SearchInput
              value={params.search}
              onChange={(search) => update({ search })}
              placeholder="Search by student or course"
              label="Search enrollments"
            />
          }
          sort={
            <SortSelect
              sort={params.sort}
              order={params.order}
              onChange={update}
              options={SORT_OPTIONS}
            />
          }
          filters={
            <>
              <FilterSelect
                label="Filter by status"
                allLabel="All statuses"
                value={params.status}
                onChange={(status) => update({ status })}
                options={toOptions(ENROLLMENT_STATUSES)}
              />
              <FilterSelect
                label="Filter by course"
                allLabel="All courses"
                value={params.course}
                onChange={(course) => update({ course })}
                options={courseOptions.options}
              />
            </>
          }
        />
        {content}
      </Card>
    </>
  );
}
