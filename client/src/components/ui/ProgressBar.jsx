import { cn } from '../../lib/cn';

/** A labelled meter; tone switches to warning near full and danger when full. */
export function ProgressBar({ value, max = 100, label, showValue = true, warnAt, className }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const isFull = warnAt !== undefined && value >= max;
  const isNearlyFull = warnAt !== undefined && percent >= warnAt;
  const barTone = isFull ? 'bg-danger-500' : isNearlyFull ? 'bg-accent-400' : 'bg-brand-500';

  return (
    <div className={cn('flex min-w-28 items-center gap-2.5', className)}>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200/80"
      >
        <div
          className={cn('h-full rounded-full transition-[width]', barTone)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue && (
        <span className="w-10 text-right text-xs font-semibold tabular-nums text-ink-muted">
          {percent}%
        </span>
      )}
    </div>
  );
}
