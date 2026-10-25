import { CircleAlert, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Link, useParams, useSearchParams } from 'react-router';
import { COURSE_CATEGORIES, COURSE_LEVELS, courseSchema, LIMITS } from '@learnsphere/shared';
import { FormSection, FormShell } from '../../components/layout/FormShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { SelectField, TextField } from '../../components/ui/FormFields';
import { toOptions } from '../../lib/options';
import { useEntityForm } from '../../hooks/useEntityForm';
import { formatDuration, totalLessonMinutes } from '../../lib/format';
import { courses } from '../../lib/resources';
import { useInstructorOptions } from '../instructors/useInstructorOptions';
import { RecordLoader } from '../RecordLoader';

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft', description: 'Hidden from enrollment while you prepare it' },
  { value: 'Published', label: 'Published', description: 'Open for students to enroll' },
  { value: 'Archived', label: 'Archived', description: 'Closed to new students, kept for records' },
];
const EMPTY_LESSON = { title: '', durationMinutes: undefined };

const toFormValues = (course, instructorId) =>
  course
    ? {
        title: course.title,
        code: course.code,
        description: course.description,
        category: course.category,
        level: course.level,
        status: course.status,
        instructor: course.instructor?._id ?? '',
        price: course.price,
        capacity: course.capacity,
        lessons: course.lessons.map(({ title, durationMinutes }) => ({ title, durationMinutes })),
      }
    : {
        title: '',
        code: '',
        description: '',
        category: '',
        level: '',
        status: 'Draft',
        instructor: instructorId ?? '',
        lessons: [EMPTY_LESSON],
      };

function LessonsEditor({ control, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'lessons' });
  const lessons = useWatch({ control, name: 'lessons' });
  const listError = errors.lessons?.message ?? errors.lessons?.root?.message;
  const canAdd = fields.length < LIMITS.lessons.max;

  return (
    <div className="space-y-4 sm:col-span-2">
      <ol className="space-y-3">
        {fields.map((field, index) => (
          <li key={field.id} className="rounded-2xl border border-line bg-surface-muted p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Lesson {index + 1}</span>
              <Button
                variant="danger-ghost"
                size="sm"
                onClick={() => remove(index)}
                disabled={fields.length <= LIMITS.lessons.min}
                aria-label={`Remove lesson ${index + 1}`}
              >
                <Trash2 /> Remove
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_11rem]">
              <TextField
                name={`lessons.${index}.title`}
                label="Lesson title"
                required
                maxLength={LIMITS.lessonTitle.max}
                placeholder="e.g. Introduction to React"
              />
              <TextField
                name={`lessons.${index}.durationMinutes`}
                label="Duration"
                required
                number
                min={LIMITS.lessonMinutes.min}
                max={LIMITS.lessonMinutes.max}
                suffix="min"
                placeholder="45"
              />
            </div>
          </li>
        ))}
      </ol>
      {listError && (
        <p role="alert" className="flex items-center gap-1.5 text-sm text-danger-700">
          <CircleAlert className="size-4" aria-hidden="true" /> {listError}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" onClick={() => append(EMPTY_LESSON)} disabled={!canAdd}>
          <Plus /> Add lesson
        </Button>
        <p className="text-sm text-ink-muted">
          {fields.length} of {LIMITS.lessons.max} lessons, total{' '}
          {formatDuration(totalLessonMinutes(lessons))}
        </p>
      </div>
    </div>
  );
}

function CourseForm({ course }) {
  const [searchParams] = useSearchParams();
  const instructorOptions = useInstructorOptions();
  const { form, onSubmit, isEdit, blocker } = useEntityForm({
    resource: courses,
    record: course,
    schema: courseSchema,
    defaultValues: toFormValues(course, searchParams.get('instructor')),
    label: 'Course',
    redirectTo: (saved) => `/courses/${saved._id}`,
  });
  const noInstructors = !instructorOptions.isPending && instructorOptions.options.length === 0;

  return (
    <>
      <PageHeader
        title={isEdit ? `Edit ${course.title}` : 'New course'}
        description={
          isEdit
            ? 'Update the course details and curriculum.'
            : 'Fill in the details below to add a course to the catalogue.'
        }
        breadcrumbs={[
          { label: 'Courses', to: '/courses' },
          ...(isEdit ? [{ label: course.title, to: `/courses/${course._id}` }] : []),
        ]}
      />
      <FormShell
        form={form}
        onSubmit={onSubmit}
        submitLabel={isEdit ? 'Save changes' : 'Create course'}
        cancelTo={isEdit ? `/courses/${course._id}` : '/courses'}
        blocker={blocker}
      >
        <FormSection title="Course basics" description="How the course appears in the catalogue.">
          <TextField
            name="title"
            label="Course title"
            required
            maxLength={LIMITS.courseTitle.max}
            placeholder="e.g. Modern Web Development with MERN"
            className="sm:col-span-2"
          />
          <TextField
            name="code"
            label="Course code"
            required
            maxLength={7}
            placeholder="e.g. WEB101"
            hint="2-4 letters followed by 3 digits. Must be unique."
            autoCapitalize="characters"
            className="[&_input:not(:placeholder-shown)]:uppercase"
          />
          <SelectField
            name="category"
            label="Category"
            required
            placeholder="Select a category"
            options={toOptions(COURSE_CATEGORIES)}
          />
          <SelectField
            name="level"
            label="Level"
            required
            placeholder="Select a level"
            options={toOptions(COURSE_LEVELS)}
          />
          <SelectField name="status" label="Status" required options={STATUS_OPTIONS} />
          <TextField
            name="description"
            label="Description"
            required
            multiline
            showCount
            rows={5}
            maxLength={LIMITS.courseDescription.max}
            placeholder="What will students learn, and who is this course for?"
            hint={`At least ${LIMITS.courseDescription.min} characters.`}
            className="sm:col-span-2"
          />
        </FormSection>

        <FormSection
          title="Teaching and enrollment"
          description="Who teaches the course, its fee and how many students it can take."
        >
          <SelectField
            name="instructor"
            label="Instructor"
            required
            placeholder={
              instructorOptions.isPending ? 'Loading instructors...' : 'Select an instructor'
            }
            options={instructorOptions.options}
            disabled={noInstructors}
            className="sm:col-span-2"
            hint={
              noInstructors ? (
                <>
                  No instructors yet.{' '}
                  <Link to="/instructors/new" className="font-semibold text-brand-700 underline">
                    Add an instructor
                  </Link>{' '}
                  first.
                </>
              ) : undefined
            }
          />
          <TextField
            name="price"
            label="Price"
            required
            number
            min={LIMITS.price.min}
            max={LIMITS.price.max}
            prefix="LKR"
            placeholder="4500"
            hint="Whole rupees. Enter 0 for a free course."
          />
          <TextField
            name="capacity"
            label="Capacity"
            required
            number
            min={LIMITS.capacity.min}
            max={LIMITS.capacity.max}
            suffix="seats"
            placeholder="40"
            hint={`Between ${LIMITS.capacity.min} and ${LIMITS.capacity.max} students.`}
          />
        </FormSection>

        <FormSection title="Curriculum" description="Lessons in the order students take them.">
          <LessonsEditor control={form.control} errors={form.formState.errors} />
        </FormSection>
      </FormShell>
    </>
  );
}

export default function CourseFormPage() {
  const { id } = useParams();
  return (
    <RecordLoader resource={courses} id={id} entityLabel="Course" backTo="/courses">
      {(course) => <CourseForm key={id ?? 'new'} course={course} />}
    </RecordLoader>
  );
}
