import { BookOpen, Mail, Pencil, Phone, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { DeleteButton } from '../../components/data/DeleteButton';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { ButtonLink } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingRows } from '../../components/ui/States';
import { APP_CONFIG } from '../../config/app';
import { formatDate } from '../../lib/format';
import { courses, instructors } from '../../lib/resources';
import { CourseCard } from '../courses/CourseCard';
import { RecordLoader } from '../RecordLoader';
import { instructorDeleteProps } from './instructorDelete';

function InstructorCourses({ instructorId }) {
  const { data, isPending, isError, error, refetch } = courses.useList({
    instructor: instructorId,
    sort: 'title',
    order: 'asc',
    limit: APP_CONFIG.pageSize.options,
  });

  return (
    <Card aria-labelledby="courses-heading">
      <CardHeader
        id="courses-heading"
        title="Courses taught"
        description={data ? `${data.meta.total} in total` : undefined}
        action={
          <ButtonLink to={`/courses/new?instructor=${instructorId}`} size="sm">
            <Plus /> New course
          </ButtonLink>
        }
      />
      {isPending ? (
        <LoadingRows rows={2} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.data.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create a course and assign it to this instructor."
        />
      ) : (
        <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5">
          {data.data.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </Card>
  );
}

function InstructorDetail({ instructor }) {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title={instructor.fullName}
        breadcrumbs={[{ label: 'Instructors', to: '/instructors' }]}
        actions={
          <>
            <ButtonLink to={`/instructors/${instructor._id}/edit`} variant="secondary">
              <Pencil /> Edit
            </ButtonLink>
            <DeleteButton
              {...instructorDeleteProps(instructor)}
              onDeleted={() => navigate('/instructors', { replace: true })}
            />
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <aside>
          <Card className="p-6 text-center" aria-label="Instructor profile">
            <Avatar name={instructor.fullName} size="lg" className="mx-auto" />
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">
              {instructor.fullName}
            </h2>
            <p className="mt-1 text-sm font-medium text-brand-700">{instructor.expertise}</p>
            {instructor.bio && (
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{instructor.bio}</p>
            )}
            <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-left text-sm">
              <li>
                <a
                  href={`mailto:${instructor.email}`}
                  className="flex items-center gap-2.5 break-all text-ink hover:text-brand-700"
                >
                  <Mail className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />{' '}
                  {instructor.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${instructor.phone}`}
                  className="flex items-center gap-2.5 text-ink hover:text-brand-700"
                >
                  <Phone className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />{' '}
                  {instructor.phone}
                </a>
              </li>
            </ul>
            <p className="mt-5 text-xs text-ink-subtle">
              Joined {formatDate(instructor.createdAt)}
            </p>
          </Card>
        </aside>
        <div className="min-w-0 lg:col-span-2">
          <InstructorCourses instructorId={instructor._id} />
        </div>
      </div>
    </>
  );
}

export default function InstructorDetailPage() {
  const { id } = useParams();
  return (
    <RecordLoader resource={instructors} id={id} entityLabel="Instructor" backTo="/instructors">
      {(instructor) => <InstructorDetail instructor={instructor} />}
    </RecordLoader>
  );
}
