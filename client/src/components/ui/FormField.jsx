import { CircleAlert } from 'lucide-react';
import { cn } from '../../lib/cn';
import { fieldClasses } from './styles';

/**
 * Label, control, hint and error message wired together for screen readers.
 * The child is a render function that receives the accessibility props for its control.
 */
export function FormField({ id, label, hint, error, required, counter, className, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const control = children({
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [errorId, hintId].filter(Boolean).join(' ') || undefined,
    'aria-required': required || undefined,
  });

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
          {required ? (
            <span className="ml-0.5 text-danger-600" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ml-1.5 text-xs font-normal text-ink-subtle">(optional)</span>
          )}
        </label>
        {counter}
      </div>
      {control}
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger-700">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Input({ prefix, suffix, className, ...props }) {
  if (!prefix && !suffix) return <input {...props} className={cn(fieldClasses, className)} />;
  return (
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-ink-subtle">
          {prefix}
        </span>
      )}
      <input
        {...props}
        className={cn(fieldClasses, prefix && 'pl-13', suffix && 'pr-12', className)}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-medium text-ink-subtle">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      {...props}
      className={cn(fieldClasses, 'h-auto min-h-28 resize-y py-2.5', className)}
    />
  );
}

/** "12 / 500" character counter shown beside a label; turns red when over the limit. */
export function CharCount({ value = '', max }) {
  const length = value.trim().length;
  return (
    <span
      className={cn('text-xs tabular-nums', length > max ? 'text-danger-600' : 'text-ink-subtle')}
    >
      {length} / {max}
    </span>
  );
}
