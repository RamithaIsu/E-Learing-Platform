import { Clock, Layers, Pencil, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import { DeleteButton } from '../../components/data/DeleteButton';
import { Badge } from '../../components/ui/Badge';
import { ButtonLink } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COURSE_STATUS_TONE, LEVEL_TONE } from '../../config/catalog';
import { formatDuration, formatPrice, pluralize, totalLessonMinutes } from '../../lib/format';
import { courses } from '../../lib/resources';
import { CourseCover } from './CourseCover';

export const COURSE_DELETE_WARNING =
  'The course and all of its enrollments will be permanently removed. This cannot be undone.';

export function CourseCard({ course }) {
  const seatsTaken = course.activeEnrollmentCount ?? 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-pop">
      <CourseCover course={course} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone={LEVEL_TONE[course.level]}>{course.level}</Badge>
          <Badge tone={COURSE_STATUS_TONE[course.status]} dot>
            {course.status}
          </Badge>
        </div>
        <h3 className="font-display text-lg leading-snug font-semibold text-ink">
          <Link
            to={`/courses/${course._id}`}
            className="after:absolute after:inset-0 hover:text-brand-700"
          >
            {course.title}
          </Link>
        </h3>
        <ul className="space-y-1.5 text-sm text-ink-muted">
          <li className="flex items-center gap-2">
            <UserRound className="size-4 text-ink-subtle" aria-hidden="true" />
            {course.instructor?.fullName ?? 'Unassigned'}
          </li>
          <li className="flex items-center gap-2">
            <Layers className="size-4 text-ink-subtle" aria-hidden="true" />
            {pluralize(course.lessons.length, 'lesson')}
            <Clock className="ml-2 size-4 text-ink-subtle" aria-hidden="true" />
            {formatDuration(totalLessonMinutes(course.lessons))}
          </li>
        </ul>
        <div className="mt-auto space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-ink-muted">
            <span>Seats taken</span>
            <span className="font-semibold tabular-nums">
              {seatsTaken} / {course.capacity}
            </span>
          </div>
          <ProgressBar
            value={seatsTaken}
            max={course.capacity}
            warnAt={80}
            showValue={false}
            label="Seats taken"
          />
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-between border-t border-line px-5 py-3">
        <p className="font-display text-lg font-semibold text-brand-800">
          {formatPrice(course.price)}
        </p>
        <div className="flex gap-1">
          <ButtonLink
            to={`/courses/${course._id}/edit`}
            variant="ghost"
            size="icon"
            aria-label={`Edit ${course.title}`}
            title="Edit"
          >
            <Pencil />
          </ButtonLink>
          <DeleteButton
            compact
            resource={courses}
            id={course._id}
            entityLabel="Course"
            name={course.title}
            description={COURSE_DELETE_WARNING}
          />
        </div>
      </div>
    </article>
  );
}
