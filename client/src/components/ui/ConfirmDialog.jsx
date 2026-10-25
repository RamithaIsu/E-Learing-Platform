import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { TriangleAlert } from 'lucide-react';
import { Button } from './Button';

/**
 * A modal confirmation for destructive or irreversible actions.
 * Without onConfirm it becomes an information dialog with a single "Got it" button.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isPending = false,
  onConfirm,
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px] motion-safe:animate-fade-in" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 shadow-pop motion-safe:animate-pop-in">
          <div className="flex gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-danger-50 text-danger-600">
              <TriangleAlert className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <AlertDialog.Title className="font-display text-lg font-semibold text-ink">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {description}
              </AlertDialog.Description>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={isPending}>
                {onConfirm ? cancelLabel : 'Got it'}
              </Button>
            </AlertDialog.Cancel>
            {onConfirm && (
              <Button variant="danger" isLoading={isPending} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            )}
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
