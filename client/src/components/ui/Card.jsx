import { cn } from '../../lib/cn';

export function Card({ as: Tag = 'section', className, children, ...props }) {
  return (
    <Tag
      {...props}
      className={cn('rounded-card border border-line bg-surface shadow-card', className)}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, action, id }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <h2 id={id} className="font-display text-lg font-semibold text-ink">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
