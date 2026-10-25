import { CloudOff, SearchX } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

export function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-stone-200/70', className)} aria-hidden="true" />
  );
}

/** Placeholder rows shown while a list loads. */
export function LoadingRows({ rows = 5, label = 'Loading' }) {
  return (
    <div role="status" aria-label={label} className="space-y-3 p-5 sm:p-6">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}

export function PageLoading({ label = 'Loading page' }) {
  return (
    <div role="status" aria-label={label} className="space-y-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-72 max-w-full" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon = SearchX, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-14 text-center', className)}>
      <div className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-8 ring-brand-50/50">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'We could not load this data' }) {
  return (
    <EmptyState
      icon={CloudOff}
      title={title}
      description={error?.message}
      action={
        onRetry && (
          <Button variant="secondary" onClick={() => onRetry()}>
            Try again
          </Button>
        )
      }
    />
  );
}
