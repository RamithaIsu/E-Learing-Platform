import { useParams } from 'react-router';
import { LIMITS, studentSchema } from '@learnsphere/shared';
import { FormSection, FormShell } from '../../components/layout/FormShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { TextField } from '../../components/ui/FormFields';
import { useEntityForm } from '../../hooks/useEntityForm';
import { toDateInputValue } from '../../lib/format';
import { students } from '../../lib/resources';
import { RecordLoader } from '../RecordLoader';

const toFormValues = (student) => ({
  fullName: student?.fullName ?? '',
  email: student?.email ?? '',
  phone: student?.phone ?? '',
  dateOfBirth: toDateInputValue(student?.dateOfBirth),
});

// The date picker only offers birthdays that pass the age rule.
function birthDateBounds() {
  const today = new Date();
  const shiftYears = (years) => {
    const date = new Date(today);
    date.setFullYear(today.getFullYear() - years);
    return date.toISOString().slice(0, 10);
  };
  return { min: shiftYears(LIMITS.studentAge.max + 1), max: shiftYears(LIMITS.studentAge.min) };
}

function StudentForm({ student }) {
  const { form, onSubmit, isEdit, blocker } = useEntityForm({
    resource: students,
    record: student,
    schema: studentSchema,
    defaultValues: toFormValues(student),
    label: 'Student',
    redirectTo: (saved) => `/students/${saved._id}`,
  });
  const bounds = birthDateBounds();

  return (
    <>
      <PageHeader
        title={isEdit ? `Edit ${student.fullName}` : 'Register student'}
        description={
          isEdit
            ? 'Update this student profile.'
            : 'Create a learner profile so the student can be enrolled in courses.'
        }
        breadcrumbs={[
          { label: 'Students', to: '/students' },
          ...(isEdit ? [{ label: student.fullName, to: `/students/${student._id}` }] : []),
        ]}
      />
      <FormShell
        form={form}
        onSubmit={onSubmit}
        submitLabel={isEdit ? 'Save changes' : 'Register student'}
        cancelTo={isEdit ? `/students/${student._id}` : '/students'}
        blocker={blocker}
      >
        <FormSection title="Personal details" description="Basic information about the learner.">
          <TextField
            name="fullName"
            label="Full name"
            required
            autoComplete="name"
            maxLength={LIMITS.name.max}
            placeholder="e.g. Kavindi Silva"
            className="sm:col-span-2"
          />
          <TextField
            name="dateOfBirth"
            label="Date of birth"
            required
            type="date"
            min={bounds.min}
            max={bounds.max}
            hint={`Students must be ${LIMITS.studentAge.min} to ${LIMITS.studentAge.max} years old.`}
          />
        </FormSection>
        <FormSection title="Contact details" description="Used for course updates and reminders.">
          <TextField
            name="email"
            label="Email address"
            required
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email.max}
            placeholder="name@example.com"
            hint="Must be unique for each student."
          />
          <TextField
            name="phone"
            label="Mobile number"
            required
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={12}
            placeholder="0771234567"
            hint="Sri Lankan mobile, e.g. 0771234567 or +94771234567."
          />
        </FormSection>
      </FormShell>
    </>
  );
}

export default function StudentFormPage() {
  const { id } = useParams();
  return (
    <RecordLoader resource={students} id={id} entityLabel="Student" backTo="/students">
      {(student) => <StudentForm key={id ?? 'new'} student={student} />}
    </RecordLoader>
  );
}
