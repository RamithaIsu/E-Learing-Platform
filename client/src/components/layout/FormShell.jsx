import { Save } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';

/**
 * Form frame: provides the form context to its fields, a sticky action bar and the
 * unsaved-changes confirmation.
 */
export function FormShell({ form, onSubmit, submitLabel, cancelTo, blocker, children }) {
  const navigate = useNavigate();
  const { isSubmitting } = form.formState;

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={onSubmit} className="space-y-6">
        {children}

        <div className="sticky bottom-0 z-20 -mx-4 border-t border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-card sm:border sm:bg-surface/90 sm:px-5 sm:shadow-card">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="hidden text-sm text-ink-muted sm:block">
              Fields marked <span className="text-danger-600">*</span> are required.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => navigate(cancelTo)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {!isSubmitting && <Save />}
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={blocker.state === 'blocked'}
          onOpenChange={(open) => !open && blocker.reset?.()}
          title="Discard unsaved changes?"
          description="You have changes that have not been saved. If you leave now they will be lost."
          cancelLabel="Keep editing"
          confirmLabel="Discard changes"
          onConfirm={() => blocker.proceed?.()}
        />
      </form>
    </FormProvider>
  );
}

/** A titled group of related fields. */
export function FormSection({ title, description, children }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
        </div>
        <div className="grid min-w-0 gap-5 sm:grid-cols-2">{children}</div>
      </div>
    </Card>
  );
}
