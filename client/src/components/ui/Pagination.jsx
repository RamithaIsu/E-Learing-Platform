import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

const WINDOW = 5;

function pageWindow(page, totalPages) {
  const start = Math.max(1, Math.min(page - Math.floor(WINDOW / 2), totalPages - WINDOW + 1));
  return Array.from({ length: Math.min(WINDOW, totalPages) }, (_, index) => start + index);
}

export function Pagination({ meta, onPageChange, noun = 'results' }) {
  if (!meta || meta.total === 0) return null;
  const { page, limit, total, totalPages } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-line px-5 py-4 sm:flex-row sm:px-6"
    >
      <p className="text-sm text-ink-muted">
        Showing <span className="font-semibold text-ink">{from}</span> to{' '}
        <span className="font-semibold text-ink">{to}</span> of{' '}
        <span className="font-semibold text-ink">{total}</span> {noun}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft />
          </Button>
          {pageWindow(page, totalPages).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => onPageChange(number)}
              aria-current={number === page ? 'page' : undefined}
              aria-label={`Page ${number}`}
              className={cn(
                'size-9 rounded-xl text-sm font-semibold tabular-nums transition-colors',
                number === page ? 'bg-brand-700 text-white' : 'text-ink-muted hover:bg-ink/5',
              )}
            >
              {number}
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </nav>
  );
}
