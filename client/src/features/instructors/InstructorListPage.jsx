import { Pencil, Plus, Presentation } from 'lucide-react';
import { Link } from 'react-router';
import { DataTable } from '../../components/data/DataTable';
import { DeleteButton } from '../../components/data/DeleteButton';
import { ListToolbar, SearchInput, SortSelect } from '../../components/data/ListToolbar';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ButtonLink } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState, ErrorState, LoadingRows } from '../../components/ui/States';
import { APP_CONFIG } from '../../config/app';
import { useListParams } from '../../hooks/useListParams';
import { cn } from '../../lib/cn';
import { pluralize } from '../../lib/format';
import { instructors } from '../../lib/resources';
import { instructorDeleteProps } from './instructorDelete';

const DEFAULTS = { search: '', sort: 'fullName', order: 'asc', page: '1' };
const SORT_OPTIONS = [
  { value: 'fullName:asc', label: 'Name (A to Z)' },
  { value: 'fullName:desc', label: 'Name (Z to A)' },
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
];

const COLUMNS = [
  {
    key: 'name',
    header: 'Instructor',
    primary: true,
    render: (row) => (
      <Link to={`/instructors/${row._id}`} className="group flex items-center gap-3">
        <Avatar name={row.fullName} size="sm" />
        <span className="min-w-0 text-left">
          <span className="block font-semibold text-ink group-hover:text-brand-700">
            {row.fullName}
          </span>
          <span className="block truncate text-xs text-ink-muted">{row.email}</span>
        </span>
      </Link>
    ),
  },
  {
    key: 'expertise',
    header: 'Expertise',
    render: (row) => <span className="text-ink-muted">{row.expertise}</span>,
  },
  {
    key: 'phone',
    header: 'Phone',
    render: (row) => <span className="whitespace-nowrap tabular-nums">{row.phone}</span>,
  },
  {
    key: 'courses',
    header: 'Courses',
    render: (row) => (
      <Badge tone={row.courseCount ? 'brand' : 'neutral'}>
        {pluralize(row.courseCount, 'course')}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    render: (row) => (
      <div className="flex justify-end gap-1">
        <ButtonLink
          to={`/instructors/${row._id}/edit`}
          variant="ghost"
          size="icon"
          aria-label={`Edit ${row.fullName}`}
          title="Edit"
        >
          <Pencil />
        </ButtonLink>
        <DeleteButton compact {...instructorDeleteProps(row)} />
      </div>
    ),
  },
];

export default function InstructorListPage() {
  const [params, update] = useListParams(DEFAULTS);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = instructors.useList({
    ...params,
    limit: APP_CONFIG.pageSize.table,
  });

  let content;
  if (isPending) content = <LoadingRows label="Loading instructors" />;
  else if (isError) content = <ErrorState error={error} onRetry={refetch} />;
  else if (data.data.length === 0) {
    content = params.search ? (
      <EmptyState
        title="No instructors match your search"
        description="Check the spelling or try a different name, email or expertise."
      />
    ) : (
      <EmptyState
        icon={Presentation}
        title="No instructors yet"
        description="Add your first instructor so you can assign them to courses."
        action={
          <ButtonLink to="/instructors/new">
            <Plus /> Add instructor
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
          <DataTable caption="Instructors" columns={COLUMNS} rows={data.data} />
        </div>
        <Pagination meta={data.meta} onPageChange={(page) => update({ page })} noun="instructors" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Instructors"
        description="The teaching team and the courses each person leads."
        actions={
          <ButtonLink to="/instructors/new">
            <Plus /> Add instructor
          </ButtonLink>
        }
      />
      <Card>
        <ListToolbar
          search={
            <SearchInput
              value={params.search}
              onChange={(search) => update({ search })}
              placeholder="Search by name, email or expertise"
              label="Search instructors"
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
        />
        {content}
      </Card>
    </>
  );
}
