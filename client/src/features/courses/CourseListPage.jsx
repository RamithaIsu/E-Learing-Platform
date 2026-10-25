import { BookOpen, Plus } from 'lucide-react';
import { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_STATUSES } from '@learnsphere/shared';
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
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/States';
import { APP_CONFIG } from '../../config/app';
import { useListParams } from '../../hooks/useListParams';
import { cn } from '../../lib/cn';
import { courses } from '../../lib/resources';
import { useInstructorOptions } from '../instructors/useInstructorOptions';
import { CourseCard } from './CourseCard';

const FILTERS = { search: '', category: '', level: '', status: '', instructor: '' };
const DEFAULTS = { ...FILTERS, sort: 'createdAt', order: 'desc', page: '1' };

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'title:asc', label: 'Title (A to Z)' },
  { value: 'title:desc', label: 'Title (Z to A)' },
  { value: 'price:asc', label: 'Price (low to high)' },
  { value: 'price:desc', label: 'Price (high to low)' },
];

function CourseGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading courses"
      className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-card border border-line">
          <Skeleton className="h-32 rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CourseListPage() {
  const [params, update] = useListParams(DEFAULTS);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = courses.useList({
    ...params,
    limit: APP_CONFIG.pageSize.grid,
  });
  const instructorOptions = useInstructorOptions();
  const hasFilters = Object.keys(FILTERS).some((key) => params[key]);

  let content;
  if (isPending) content = <CourseGridSkeleton />;
  else if (isError) content = <ErrorState error={error} onRetry={refetch} />;
  else if (data.data.length === 0) {
    content = hasFilters ? (
      <EmptyState
        title="No courses match your filters"
        description="Try a different search term or clear the filters to see every course."
      />
    ) : (
      <EmptyState
        icon={BookOpen}
        title="No courses yet"
        description="Create your first course to start building the catalogue."
        action={
          <ButtonLink to="/courses/new">
            <Plus /> New course
          </ButtonLink>
        }
      />
    );
  } else {
    content = (
      <>
        <div
          aria-busy={isPlaceholderData}
          className={cn(
            'grid gap-5 p-4 transition-opacity sm:grid-cols-2 sm:p-5 xl:grid-cols-3',
            isPlaceholderData && 'opacity-60',
          )}
        >
          {data.data.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
        <Pagination meta={data.meta} onPageChange={(page) => update({ page })} noun="courses" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Courses"
        description="Browse, search and manage the course catalogue."
        actions={
          <ButtonLink to="/courses/new">
            <Plus /> New course
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
              placeholder="Search by title or code"
              label="Search courses"
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
                label="Filter by category"
                allLabel="All categories"
                value={params.category}
                onChange={(category) => update({ category })}
                options={toOptions(COURSE_CATEGORIES)}
              />
              <FilterSelect
                label="Filter by level"
                allLabel="All levels"
                value={params.level}
                onChange={(level) => update({ level })}
                options={toOptions(COURSE_LEVELS)}
              />
              <FilterSelect
                label="Filter by status"
                allLabel="All statuses"
                value={params.status}
                onChange={(status) => update({ status })}
                options={toOptions(COURSE_STATUSES)}
              />
              <FilterSelect
                label="Filter by instructor"
                allLabel="All instructors"
                value={params.instructor}
                onChange={(instructor) => update({ instructor })}
                options={instructorOptions.options}
              />
            </>
          }
        />
        {content}
      </Card>
    </>
  );
}
