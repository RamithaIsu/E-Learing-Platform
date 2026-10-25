import { cn } from '../../lib/cn';

/** Class recipes shared by several components. */

export const fieldClasses = cn(
  'h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink shadow-xs transition',
  'placeholder:text-ink-subtle hover:border-ink-subtle',
  'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus-visible:outline-none',
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle',
  'aria-[invalid=true]:border-danger-500 aria-[invalid=true]:focus:ring-danger-500/15',
);

const VARIANTS = {
  primary: 'bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900',
  accent: 'bg-accent-300 text-brand-950 shadow-sm hover:bg-accent-200',
  secondary:
    'border border-line-strong bg-surface text-ink shadow-xs hover:border-ink-subtle hover:bg-surface-muted',
  ghost: 'text-ink-muted hover:bg-ink/5 hover:text-ink',
  danger: 'bg-danger-600 text-white shadow-sm hover:bg-danger-700',
  'danger-ghost': 'text-ink-muted hover:bg-danger-50 hover:text-danger-700',
};

const SIZES = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-4.5 text-sm',
  icon: 'size-9',
};

export const buttonClasses = ({ variant = 'primary', size = 'md', className } = {}) =>
  cn(
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-colors',
    'disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
