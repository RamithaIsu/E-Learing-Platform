import { Pencil } from 'lucide-react';
import { Link } from 'react-router';
import { DeleteButton } from '../../components/data/DeleteButton';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ButtonLink } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ENROLLMENT_STATUS_TONE } from '../../config/catalog';
import { formatDate } from '../../lib/format';
import { enrollments } from '../../lib/resources';

const enrollmentName = (row) => `${row.student.fullName} in ${row.course.code}`;

/** Table columns for enrollments; `hide` drops the column already implied by the page. */
export function enrollmentColumns({ hide } = {}) {
  const columns = [
    {
      key: 'student',
      header: 'Student',
      primary: hide !== 'student',
      render: (row) => (
        <Link to={`/students/${row.student._id}`} className="group flex items-center gap-3">
          <Avatar name={row.student.fullName} size="sm" />
          <span className="min-w-0 text-left">
            <span className="block font-semibold text-ink group-hover:text-brand-700">
              {row.student.fullName}
            </span>
            <span className="block truncate text-xs text-ink-muted">{row.student.email}</span>
          </span>
        </Link>
      ),
    },
    {
      key: 'course',
      header: 'Course',
      primary: hide === 'student',
      render: (row) => (
        <Link to={`/courses/${row.course._id}`} className="group block min-w-0 text-left">
          <span className="block font-semibold text-ink group-hover:text-brand-700">
            {row.course.title}
          </span>
          <span className="block text-xs font-medium tracking-wide text-ink-muted">
            {row.course.code}
          </span>
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge tone={ENROLLMENT_STATUS_TONE[row.status]} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (row) => (
        <ProgressBar
          value={row.progress}
          label={`Progress of ${enrollmentName(row)}`}
          className="w-32"
        />
      ),
    },
    {
      key: 'enrolledAt',
      header: 'Enrolled',
      render: (row) => (
        <span className="whitespace-nowrap text-ink-muted">{formatDate(row.enrolledAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <ButtonLink
            to={`/enrollments/${row._id}/edit`}
            variant="ghost"
            size="icon"
            aria-label={`Edit enrollment of ${enrollmentName(row)}`}
            title="Edit"
          >
            <Pencil />
          </ButtonLink>
          <DeleteButton
            compact
            resource={enrollments}
            id={row._id}
            entityLabel="Enrollment"
            name={`the enrollment of ${row.student.fullName}`}
            description={`${row.student.fullName} will be removed from ${row.course.title}. Their progress record will be lost.`}
          />
        </div>
      ),
    },
  ];
  return columns.filter((column) => column.key !== hide);
}
