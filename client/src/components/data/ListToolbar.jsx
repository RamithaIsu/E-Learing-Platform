import { FilterX, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { APP_CONFIG } from '../../config/app';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { fieldClasses } from '../ui/styles';
import { Select } from '../ui/Select';

const ALL = '__all__';

/** Search and sort on the first row, filter dropdowns in a grid below. */
export function ListToolbar({ search, sort, filters, canClear, onClear }) {
  return (
    <div className="space-y-3 border-b border-line p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {search}
        <div className="sm:w-56 sm:shrink-0">{sort}</div>
      </div>
      {(filters || canClear) && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {filters && <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-4">{filters}</div>}
          {canClear && (
            <Button variant="ghost" size="sm" onClick={onClear} className="self-start lg:self-auto">
              <FilterX /> Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** Search box that updates the list after the user pauses typing. */
export function SearchInput({ value, onChange, placeholder, label }) {
  const [text, setText] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const timer = useRef();

  // Follow outside changes such as "Clear filters".
  if (value !== syncedValue) {
    setSyncedValue(value);
    setText(value);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleChange = (event) => {
    const next = event.target.value;
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next.trim()), APP_CONFIG.searchDebounceMs);
  };

  const clear = () => {
    clearTimeout(timer.current);
    setText('');
    onChange('');
  };

  return (
    <div className="relative min-w-0 flex-1">
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden="true"
      />
      <input
        type="search"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={label}
        maxLength={100}
        className={cn(fieldClasses, 'pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden')}
      />
      {text && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-ink-subtle hover:bg-ink/5 hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/** A filter dropdown whose first option means "no filter". */
export function FilterSelect({ value, onChange, options, allLabel, label }) {
  return (
    <Select
      aria-label={label}
      value={value || ALL}
      onValueChange={(next) => onChange(next === ALL ? '' : next)}
      options={[{ value: ALL, label: allLabel }, ...options]}
    />
  );
}

/** One dropdown for field and direction, e.g. "price:asc". */
export function SortSelect({ sort, order, onChange, options }) {
  return (
    <Select
      aria-label="Sort by"
      value={`${sort}:${order}`}
      onValueChange={(next) => {
        const [nextSort, nextOrder] = next.split(':');
        onChange({ sort: nextSort, order: nextOrder });
      }}
      options={options}
    />
  );
}
