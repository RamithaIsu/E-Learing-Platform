import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

/**
 * Delete with confirmation. When blockedReason is set the dialog only explains why the
 * record cannot be deleted yet; the server enforces the same rule.
 */
export function DeleteButton({
  resource,
  id,
  entityLabel,
  name,
  description,
  blockedReason,
  onDeleted,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const remove = resource.useRemove();

  const confirm = () =>
    remove.mutate(id, {
      onSuccess: () => {
        setOpen(false);
        toast.success(`${entityLabel} deleted`);
        onDeleted?.();
      },
      onError: (error) => {
        setOpen(false);
        toast.error(error.message);
      },
    });

  return (
    <>
      {compact ? (
        <Button
          variant="danger-ghost"
          size="icon"
          aria-label={`Delete ${name}`}
          title="Delete"
          onClick={() => setOpen(true)}
        >
          <Trash2 />
        </Button>
      ) : (
        <Button variant="secondary" onClick={() => setOpen(true)} className="text-danger-700">
          <Trash2 /> Delete
        </Button>
      )}
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={blockedReason ? `${name} cannot be deleted yet` : `Delete ${name}?`}
        description={blockedReason ?? description ?? 'This action cannot be undone.'}
        confirmLabel={`Delete ${entityLabel.toLowerCase()}`}
        isPending={remove.isPending}
        onConfirm={blockedReason ? undefined : confirm}
      />
    </>
  );
}
