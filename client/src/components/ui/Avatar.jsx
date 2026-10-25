import { cn } from '../../lib/cn';
import { initials } from '../../lib/format';

const PALETTE = [
  'bg-brand-100 text-brand-800',
  'bg-accent-100 text-accent-700',
  'bg-sky-100 text-sky-800',
  'bg-violet-100 text-violet-800',
  'bg-rose-100 text-rose-800',
  'bg-emerald-100 text-emerald-800',
];

// The same name always gets the same colour.
const colourFor = (name) =>
  PALETTE[[...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % PALETTE.length];

export function Avatar({ name = '', size = 'md', className }) {
  const sizes = { sm: 'size-9 text-xs', md: 'size-11 text-sm', lg: 'size-16 text-xl' };
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-bold',
        sizes[size],
        colourFor(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
