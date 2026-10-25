import { Cake, Mail, Pencil, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { calculateAge } from '@learnsphere/shared';
import { DeleteButton } from '../../components/data/DeleteButton';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { ButtonLink } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatDate, formatDateOnly } from '../../lib/format';
import { students } from '../../lib/resources';
import { RelatedEnrollments } from '../enrollments/RelatedEnrollments';
import { RecordLoader } from '../RecordLoader';
import { studentDeleteProps } from './studentDelete';

function StudentDetail({ student }) {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title={student.fullName}
        breadcrumbs={[{ label: 'Students', to: '/students' }]}
        actions={
          <>
            <ButtonLink to={`/students/${student._id}/edit`} variant="secondary">
              <Pencil /> Edit
            </ButtonLink>
            <DeleteButton
              {...studentDeleteProps(student)}
              onDeleted={() => navigate('/students', { replace: true })}
            />
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <aside>
          <Card className="p-6 text-center" aria-label="Student profile">
            <Avatar name={student.fullName} size="lg" className="mx-auto" />
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">{student.fullName}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {calculateAge(student.dateOfBirth)} years old
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-left text-sm">
              <li>
                <a
                  href={`mailto:${student.email}`}
                  className="flex items-center gap-2.5 break-all text-ink hover:text-brand-700"
                >
                  <Mail className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />{' '}
                  {student.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${student.phone}`}
                  className="flex items-center gap-2.5 text-ink hover:text-brand-700"
                >
                  <Phone className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />{' '}
                  {student.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-ink">
                <Cake className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" /> Born{' '}
                {formatDateOnly(student.dateOfBirth)}
              </li>
            </ul>
            <p className="mt-5 text-xs text-ink-subtle">
              Registered {formatDate(student.createdAt)}
            </p>
          </Card>
        </aside>
        <div className="min-w-0 lg:col-span-2">
          <RelatedEnrollments
            filter={{ student: student._id }}
            hide="student"
            addTo={`/enrollments/new?student=${student._id}`}
            emptyText='Use "Enroll" to add this student to a published course.'
          />
        </div>
      </div>
    </>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams();
  return (
    <RecordLoader resource={students} id={id} entityLabel="Student" backTo="/students">
      {(student) => <StudentDetail student={student} />}
    </RecordLoader>
  );
}
