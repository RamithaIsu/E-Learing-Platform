import { BookOpen, GraduationCap } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router';
import { enrollmentCreateSchema, enrollmentUpdateSchema, LIMITS } from '@learnsphere/shared';
import { FormSection, FormShell } from '../../components/layout/FormShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { SelectField, TextField } from '../../components/ui/FormFields';
import { useEntityForm } from '../../hooks/useEntityForm';
import { enrollments } from '../../lib/resources';
import { RecordLoader } from '../RecordLoader';
import { useCourseOptions, useStudentOptions } from './useCourseOptions';

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active', description: 'Currently studying (uses a seat)' },
  { value: 'Completed', label: 'Completed', description: 'Finished every lesson (100% progress)' },
  { value: 'Dropped', label: 'Dropped', description: 'Left the course (frees the seat)' },
];

// Return to the page the user came from (course, student or list) when there is one.
const backOrList = () => (window.history.state?.idx > 0 ? -1 : '/enrollments');

function ReadOnlyLink({ icon: Icon, label, to, title, subtitle }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-muted p-4">
      <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">{label}</p>
      <Link to={to} className="mt-2 flex items-center gap-3 hover:text-brand-700">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{title}</span>
          <span className="block truncate text-sm text-ink-muted">{subtitle}</span>
        </span>
      </Link>
    </div>
  );
}

function EnrollmentForm({ enrollment }) {
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(enrollment);
  const studentOptions = useStudentOptions();
  const courseOptions = useCourseOptions({ forEnrollment: true });

  const { form, onSubmit, blocker } = useEntityForm({
    resource: enrollments,
    record: enrollment,
    schema: isEdit ? enrollmentUpdateSchema : enrollmentCreateSchema,
    defaultValues: isEdit
      ? { status: enrollment.status, progress: enrollment.progress }
      : {
          student: searchParams.get('student') ?? '',
          course: searchParams.get('course') ?? '',
          status: 'Active',
          progress: 0,
        },
    label: 'Enrollment',
    redirectTo: backOrList,
  });

  // Completing a course implies every lesson is done.
  const handleStatusChange = (status) => {
    if (status === 'Completed') {
      form.setValue('progress', LIMITS.progress.max, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit enrollment' : 'Enroll a student'}
        description={
          isEdit
            ? 'Update the status and progress of this enrollment.'
            : 'Choose a student and a published course with free seats.'
        }
        breadcrumbs={[{ label: 'Enrollments', to: '/enrollments' }]}
      />
      <FormShell
        form={form}
        onSubmit={onSubmit}
        submitLabel={isEdit ? 'Save changes' : 'Enroll student'}
        cancelTo={backOrList()}
        blocker={blocker}
      >
        <FormSection
          title="Student and course"
          description={
            isEdit
              ? 'These cannot change. To move a student, delete this enrollment and create a new one.'
              : 'Only published courses with free seats can be selected.'
          }
        >
          {isEdit ? (
            <>
              <ReadOnlyLink
                icon={GraduationCap}
                label="Student"
                to={`/students/${enrollment.student._id}`}
                title={enrollment.student.fullName}
                subtitle={enrollment.student.email}
              />
              <ReadOnlyLink
                icon={BookOpen}
                label="Course"
                to={`/courses/${enrollment.course._id}`}
                title={enrollment.course.title}
                subtitle={enrollment.course.code}
              />
            </>
          ) : (
            <>
              <SelectField
                name="student"
                label="Student"
                required
                placeholder={studentOptions.isPending ? 'Loading students...' : 'Select a student'}
                options={studentOptions.options}
                hint={
                  !studentOptions.isPending && studentOptions.options.length === 0 ? (
                    <>
                      No students yet.{' '}
                      <Link to="/students/new" className="font-semibold text-brand-700 underline">
                        Register a student
                      </Link>{' '}
                      first.
                    </>
                  ) : undefined
                }
              />
              <SelectField
                name="course"
                label="Course"
                required
                placeholder={courseOptions.isPending ? 'Loading courses...' : 'Select a course'}
                options={courseOptions.options}
                hint={
                  !courseOptions.isPending && courseOptions.options.length === 0
                    ? 'No published courses yet. Publish a course to accept enrollments.'
                    : undefined
                }
              />
            </>
          )}
        </FormSection>

        <FormSection title="Progress" description="Track how far the student has come.">
          <SelectField
            name="status"
            label="Status"
            required
            options={STATUS_OPTIONS}
            onValueChange={handleStatusChange}
          />
          <TextField
            name="progress"
            label="Progress"
            required
            number
            min={LIMITS.progress.min}
            max={LIMITS.progress.max}
            suffix="%"
            hint="Whole number from 0 to 100. Completed enrollments must be at 100%."
          />
        </FormSection>
      </FormShell>
    </>
  );
}

export default function EnrollmentFormPage() {
  const { id } = useParams();
  return (
    <RecordLoader resource={enrollments} id={id} entityLabel="Enrollment" backTo="/enrollments">
      {(enrollment) => <EnrollmentForm key={id ?? 'new'} enrollment={enrollment} />}
    </RecordLoader>
  );
}
