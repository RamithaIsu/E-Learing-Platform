import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { APP_CONFIG } from '../../config/app';

/** Page title (also sets the browser tab title), optional breadcrumbs, description and actions. */
export function PageHeader({ title, description, breadcrumbs = [], actions, eyebrow }) {
  return (
    <header className="mb-6 sm:mb-8">
      <title>{`${title} | ${APP_CONFIG.name}`}</title>
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
            {breadcrumbs.map((crumb) => (
              <li key={crumb.to} className="flex items-center gap-1">
                <Link to={crumb.to} className="rounded hover:text-brand-700 hover:underline">
                  {crumb.label}
                </Link>
                <ChevronRight className="size-3.5 text-ink-subtle" aria-hidden="true" />
              </li>
            ))}
            <li aria-current="page" className="max-w-[16rem] truncate font-medium text-ink">
              {title}
            </li>
          </ol>
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow}
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          {description && <p className="mt-2 max-w-2xl text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 sm:shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
