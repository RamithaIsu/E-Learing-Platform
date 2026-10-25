import { useParams } from 'react-router';
import { instructorSchema, LIMITS } from '@learnsphere/shared';
import { FormSection, FormShell } from '../../components/layout/FormShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { TextField } from '../../components/ui/FormFields';
import { useEntityForm } from '../../hooks/useEntityForm';
import { instructors } from '../../lib/resources';
import { RecordLoader } from '../RecordLoader';

const toFormValues = (instructor) => ({
  fullName: instructor?.fullName ?? '',
  email: instructor?.email ?? '',
  phone: instructor?.phone ?? '',
  expertise: instructor?.expertise ?? '',
  bio: instructor?.bio ?? '',
});

function InstructorForm({ instructor }) {
  const { form, onSubmit, isEdit, blocker } = useEntityForm({
    resource: instructors,
    record: instructor,
    schema: instructorSchema,
    defaultValues: toFormValues(instructor),
    label: 'Instructor',
    redirectTo: (saved) => `/instructors/${saved._id}`,
  });

  return (
    <>
      <PageHeader
        title={isEdit ? `Edit ${instructor.fullName}` : 'Add instructor'}
        description={
          isEdit
            ? 'Update this instructor profile.'
            : 'Create a profile for a new member of the teaching team.'
        }
        breadcrumbs={[
          { label: 'Instructors', to: '/instructors' },
          ...(isEdit ? [{ label: instructor.fullName, to: `/instructors/${instructor._id}` }] : []),
        ]}
      />
      <FormShell
        form={form}
        onSubmit={onSubmit}
        submitLabel={isEdit ? 'Save changes' : 'Add instructor'}
        cancelTo={isEdit ? `/instructors/${instructor._id}` : '/instructors'}
        blocker={blocker}
      >
        <FormSection
          title="Personal details"
          description="How students and staff can reach this instructor."
        >
          <TextField
            name="fullName"
            label="Full name"
            required
            autoComplete="name"
            maxLength={LIMITS.name.max}
            placeholder="e.g. Nadeesha Perera"
            className="sm:col-span-2"
          />
          <TextField
            name="email"
            label="Email address"
            required
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email.max}
            placeholder="name@example.com"
            hint="Must be unique. Used for course communication."
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
        <FormSection
          title="Teaching profile"
          description="Shown on the instructor page and course pages."
        >
          <TextField
            name="expertise"
            label="Area of expertise"
            required
            maxLength={LIMITS.expertise.max}
            placeholder="e.g. Full-stack web development"
            className="sm:col-span-2"
          />
          <TextField
            name="bio"
            label="Short bio"
            multiline
            showCount
            rows={4}
            maxLength={LIMITS.bio.max}
            placeholder="A few sentences about their background and teaching style."
            className="sm:col-span-2"
          />
        </FormSection>
      </FormShell>
    </>
  );
}

export default function InstructorFormPage() {
  const { id } = useParams();
  return (
    <RecordLoader resource={instructors} id={id} entityLabel="Instructor" backTo="/instructors">
      {(instructor) => <InstructorForm key={id ?? 'new'} instructor={instructor} />}
    </RecordLoader>
  );
}
