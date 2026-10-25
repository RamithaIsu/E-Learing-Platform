import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Plus,
  Presentation,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '../../components/ui/Badge';
import { ButtonLink } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState, ErrorState, LoadingRows, Skeleton } from '../../components/ui/States';
import { APP_CONFIG } from '../../config/app';
import { ENROLLMENT_STATUS_TONE } from '../../config/catalog';
import { formatDate } from '../../lib/format';
import { useStats } from '../../lib/resources';

const QUICK_ACTIONS = [
  {
    to: '/courses/new',
    label: 'Create a course',
    hint: 'Add lessons, price and seats',
    icon: BookOpen,
  },
  {
    to: '/instructors/new',
    label: 'Add an instructor',
    hint: 'Build your teaching team',
    icon: Presentation,
  },
  {
    to: '/students/new',
    label: 'Register a student',
    hint: 'Create a learner profile',
    icon: UserPlus,
  },
  {
    to: '/enrollments/new',
    label: 'Enroll a student',
    hint: 'Assign a learner to a course',
    icon: ClipboardList,
  },
];

function StatCard({ label, value, detail, icon: Icon, to, isLoading }) {
  return (
    <Card as="article" className="group relative p-5 transition-shadow hover:shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-ink-muted">{label}</p>
        <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-9 w-16" />
      ) : (
        <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink tabular-nums">
          {value}
        </p>
      )}
      <p className="mt-1 text-sm text-ink-subtle">{detail}</p>
      <Link
        to={to}
        className="absolute inset-0 rounded-card"
        aria-label={`View ${label.toLowerCase()}`}
      />
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isPending, isError, error, refetch } = useStats();
  const counts = data?.counts ?? {};

  return (
    <div className="space-y-8">
      <title>{`Dashboard | ${APP_CONFIG.name}`}</title>

      <section className="relative overflow-hidden rounded-[1.5rem] bg-brand-950 px-6 py-9 text-white sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full border-[28px] border-brand-800/60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-28 size-72 rounded-full bg-accent-300/15 blur-2xl"
        />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold tracking-wider text-accent-300 uppercase">
            Welcome to {APP_CONFIG.name}
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-5xl">
            Shape every learning journey from one place.
          </h1>
          <p className="mt-4 max-w-xl text-brand-100/85">
            Manage your course catalogue, teaching team, learners and their progress with clear,
            simple workflows.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/courses/new" variant="accent">
              <Plus /> New course
            </ButtonLink>
            <ButtonLink
              to="/enrollments/new"
              variant="secondary"
              className="border-white/20 bg-white/8 text-white hover:border-white/40 hover:bg-white/14"
            >
              <ClipboardList /> Enroll a student
            </ButtonLink>
          </div>
        </div>
      </section>

      {isError ? (
        <Card>
          <ErrorState error={error} onRetry={refetch} />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Courses"
            value={counts.courses}
            detail={`${counts.publishedCourses ?? 0} published`}
            icon={BookOpen}
            to="/courses"
            isLoading={isPending}
          />
          <StatCard
            label="Instructors"
            value={counts.instructors}
            detail="Teaching team"
            icon={Presentation}
            to="/instructors"
            isLoading={isPending}
          />
          <StatCard
            label="Students"
            value={counts.students}
            detail="Registered learners"
            icon={GraduationCap}
            to="/students"
            isLoading={isPending}
          />
          <StatCard
            label="Active enrollments"
            value={counts.activeEnrollments}
            detail={`${counts.enrollments ?? 0} in total`}
            icon={ClipboardList}
            to="/enrollments"
            isLoading={isPending}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" aria-labelledby="recent-heading">
          <CardHeader
            id="recent-heading"
            title="Recent enrollments"
            description="The latest learners to join a course."
            action={
              <Link
                to="/enrollments"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
              >
                View all <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
          {isPending ? (
            <LoadingRows rows={3} />
          ) : data?.recentEnrollments.length ? (
            <ul className="divide-y divide-line">
              {data.recentEnrollments.map((enrollment) => (
                <li
                  key={enrollment._id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/students/${enrollment.student._id}`}
                      className="font-semibold text-ink hover:text-brand-700"
                    >
                      {enrollment.student.fullName}
                    </Link>
                    <p className="truncate text-sm text-ink-muted">
                      {enrollment.course.code} - {enrollment.course.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:w-72">
                    <ProgressBar
                      value={enrollment.progress}
                      label={`${enrollment.student.fullName} progress`}
                      className="flex-1"
                    />
                    <Badge tone={ENROLLMENT_STATUS_TONE[enrollment.status]} dot>
                      {enrollment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-subtle sm:w-24 sm:text-right">
                    {formatDate(enrollment.enrolledAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No enrollments yet"
              description="Enroll a student in a published course to see activity here."
              action={
                <ButtonLink to="/enrollments/new">
                  <Plus /> Enroll a student
                </ButtonLink>
              }
            />
          )}
        </Card>

        <Card aria-labelledby="actions-heading">
          <CardHeader
            id="actions-heading"
            title="Quick actions"
            description="Common tasks in one click."
          />
          <ul className="space-y-1 p-3">
            {QUICK_ACTIONS.map(({ to, label, hint, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-brand-50"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{label}</span>
                    <span className="block text-xs text-ink-muted">{hint}</span>
                  </span>
                  <ArrowRight
                    className="size-4 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
