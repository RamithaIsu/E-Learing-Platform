import { GraduationCap, Pencil, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { calculateAge } from '@learnsphere/shared';
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
import { formatDate, pluralize } from '../../lib/format';
import { students } from '../../lib/resources';
import { studentDeleteProps } from './studentDelete';

const DEFAULTS = { search: '', sort: 'fullName', order: 'asc', page: '1' };
const SORT_OPTIONS = [
  { value: 'fullName:asc', label: 'Name (A to Z)' },
  { value: 'fullName:desc', label: 'Name (Z to A)' },
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'dateOfBirth:desc', label: 'Youngest first' },
  { value: 'dateOfBirth:asc', label: 'Oldest age first' },
];

const COLUMNS = [
  {
    key: 'name',
    header: 'Student',
    primary: true,
    render: (row) => (
      <Link to={`/students/${row._id}`} className="group flex items-center gap-3">
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
    key: 'phone',
    header: 'Phone',
    render: (row) => <span className="whitespace-nowrap tabular-nums">{row.phone}</span>,
  },
  {
    key: 'age',
    header: 'Age',
    render: (row) => <span className="tabular-nums">{calculateAge(row.dateOfBirth)} years</span>,
  },
  {
    key: 'enrollments',
    header: 'Enrollments',
    render: (row) => (
      <Badge tone={row.enrollmentCount ? 'info' : 'neutral'}>
        {pluralize(row.enrollmentCount, 'course')}
      </Badge>
    ),
  },
  {
    key: 'joined',
    header: 'Registered',
    render: (row) => (
      <span className="whitespace-nowrap text-ink-muted">{formatDate(row.createdAt)}</span>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    render: (row) => (
      <div className="flex justify-end gap-1">
        <ButtonLink
          to={`/students/${row._id}/edit`}
          variant="ghost"
          size="icon"
          aria-label={`Edit ${row.fullName}`}
          title="Edit"
        >
          <Pencil />
        </ButtonLink>
        <DeleteButton compact {...studentDeleteProps(row)} />
      </div>
    ),
  },
];

export default function StudentListPage() {
  const [params, update] = useListParams(DEFAULTS);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = students.useList({
    ...params,
    limit: APP_CONFIG.pageSize.table,
  });

  let content;
  if (isPending) content = <LoadingRows label="Loading students" />;
  else if (isError) content = <ErrorState error={error} onRetry={refetch} />;
  else if (data.data.length === 0) {
    content = params.search ? (
      <EmptyState
        title="No students match your search"
        description="Check the spelling or try a different name, email or phone number."
      />
    ) : (
      <EmptyState
        icon={GraduationCap}
        title="No students yet"
        description="Register your first student to start enrolling them in courses."
        action={
          <ButtonLink to="/students/new">
            <Plus /> Register student
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
          <DataTable caption="Students" columns={COLUMNS} rows={data.data} />
        </div>
        <Pagination meta={data.meta} onPageChange={(page) => update({ page })} noun="students" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Students"
        description="Registered learners and the courses they take."
        actions={
          <ButtonLink to="/students/new">
            <Plus /> Register student
          </ButtonLink>
        }
      />
      <Card>
        <ListToolbar
          search={
            <SearchInput
              value={params.search}
              onChange={(search) => update({ search })}
              placeholder="Search by name, email or phone"
              label="Search students"
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
