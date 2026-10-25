import { Mail, Pencil, UserPlus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { DeleteButton } from '../../components/data/DeleteButton';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ButtonLink } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COURSE_STATUS_TONE, LEVEL_TONE } from '../../config/catalog';
import {
  formatDate,
  formatDuration,
  formatPrice,
  pluralize,
  totalLessonMinutes,
} from '../../lib/format';
import { courses } from '../../lib/resources';
import { RelatedEnrollments } from '../enrollments/RelatedEnrollments';
import { RecordLoader } from '../RecordLoader';
import { CourseCover } from './CourseCover';

function enrollmentBlocker(course, seatsLeft) {
  if (course.status !== 'Published') return 'Publish this course to accept enrollments.';
  if (seatsLeft <= 0) return 'This course is full. Increase its capacity to enroll more students.';
  return null;
}

function CourseDetail({ course }) {
  const navigate = useNavigate();
  const seatsLeft = course.capacity - course.activeEnrollmentCount;
  const blocker = enrollmentBlocker(course, seatsLeft);
  const totalMinutes = totalLessonMinutes(course.lessons);

  const facts = [
    ['Category', course.category],
    ['Level', course.level],
    ['Lessons', pluralize(course.lessons.length, 'lesson')],
    ['Total duration', formatDuration(totalMinutes)],
    ['Created', formatDate(course.createdAt)],
    ['Last updated', formatDate(course.updatedAt)],
  ];

  return (
    <>
      <PageHeader
        title={course.title}
        breadcrumbs={[{ label: 'Courses', to: '/courses' }]}
        eyebrow={
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge tone="neutral">{course.code}</Badge>
            <Badge tone={LEVEL_TONE[course.level]}>{course.level}</Badge>
            <Badge tone={COURSE_STATUS_TONE[course.status]} dot>
              {course.status}
            </Badge>
          </div>
        }
        actions={
          <>
            <ButtonLink to={`/courses/${course._id}/edit`} variant="secondary">
              <Pencil /> Edit
            </ButtonLink>
            <DeleteButton
              resource={courses}
              id={course._id}
              entityLabel="Course"
              name={course.title}
              description={`The course and its ${pluralize(course.enrollmentCount, 'enrollment')} will be permanently removed. This cannot be undone.`}
              onDeleted={() => navigate('/courses', { replace: true })}
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <CourseCover course={course} large />

          <Card aria-labelledby="about-heading">
            <CardHeader id="about-heading" title="About this course" />
            <p className="px-5 py-5 leading-relaxed whitespace-pre-line text-ink-muted sm:px-6">
              {course.description}
            </p>
          </Card>

          <Card aria-labelledby="curriculum-heading">
            <CardHeader
              id="curriculum-heading"
              title="Curriculum"
              description={`${pluralize(course.lessons.length, 'lesson')}, ${formatDuration(totalMinutes)} in total`}
            />
            <ol className="divide-y divide-line">
              {course.lessons.map((lesson, index) => (
                <li
                  key={`${index}-${lesson.title}`}
                  className="flex items-center gap-4 px-5 py-3.5 sm:px-6"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 tabular-nums">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 font-medium text-ink">{lesson.title}</span>
                  <span className="text-sm whitespace-nowrap text-ink-muted">
                    {formatDuration(lesson.durationMinutes)}
                  </span>
                </li>
              ))}
            </ol>
          </Card>

          <RelatedEnrollments
            filter={{ course: course._id }}
            hide="course"
            addTo={blocker ? undefined : `/enrollments/new?course=${course._id}`}
            emptyText={blocker ?? 'Use "Enroll" to add the first student to this course.'}
          />
        </div>

        <aside className="space-y-6">
          <Card className="p-5 sm:p-6" aria-label="Course summary">
            <p className="text-sm font-semibold text-ink-muted">Course fee</p>
            <p className="mt-1 font-display text-3xl font-semibold text-brand-800">
              {formatPrice(course.price)}
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-ink">Seats</span>
                <span className="text-ink-muted tabular-nums">
                  {course.activeEnrollmentCount} of {course.capacity} taken
                </span>
              </div>
              <ProgressBar
                value={course.activeEnrollmentCount}
                max={course.capacity}
                warnAt={80}
                label="Seats taken"
              />
              <p className="text-xs text-ink-subtle">
                {pluralize(Math.max(seatsLeft, 0), 'seat')} left
              </p>
            </div>

            <dl className="mt-5 divide-y divide-line border-t border-line text-sm">
              {facts.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink-muted">{term}</dt>
                  <dd className="text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            {blocker ? (
              <p className="mt-5 rounded-xl bg-accent-50 px-3.5 py-3 text-sm text-accent-700 ring-1 ring-accent-100">
                {blocker}
              </p>
            ) : (
              <ButtonLink to={`/enrollments/new?course=${course._id}`} className="mt-5 w-full">
                <UserPlus /> Enroll a student
              </ButtonLink>
            )}
          </Card>

          {course.instructor && (
            <Card className="p-5 sm:p-6" aria-labelledby="instructor-heading">
              <h2 id="instructor-heading" className="text-sm font-semibold text-ink-muted">
                Instructor
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={course.instructor.fullName} />
                <div className="min-w-0">
                  <Link
                    to={`/instructors/${course.instructor._id}`}
                    className="font-semibold text-ink hover:text-brand-700"
                  >
                    {course.instructor.fullName}
                  </Link>
                  <p className="text-sm text-ink-muted">{course.instructor.expertise}</p>
                </div>
              </div>
              <a
                href={`mailto:${course.instructor.email}`}
                className="mt-4 flex items-center gap-2 text-sm break-all text-brand-700 hover:underline"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" /> {course.instructor.email}
              </a>
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  return (
    <RecordLoader resource={courses} id={id} entityLabel="Course" backTo="/courses">
      {(course) => <CourseDetail course={course} />}
    </RecordLoader>
  );
}
