import { CATEGORY_STYLES } from '../../config/catalog';
import { cn } from '../../lib/cn';

/** Decorative cover art generated from the course category (no image upload needed). */
export function CourseCover({ course, large = false, className }) {
  const { icon: Icon, gradient } = CATEGORY_STYLES[course.category] ?? CATEGORY_STYLES.Programming;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-linear-to-br text-white',
        gradient,
        large ? 'h-44 rounded-card sm:h-56' : 'h-32',
        className,
      )}
    >
      <div className="absolute -top-10 -right-10 size-40 rounded-full border-[18px] border-white/10" />
      <div className="absolute -bottom-16 -left-8 size-44 rounded-full bg-white/8" />
      <Icon
        className={cn(
          'absolute opacity-30',
          large ? 'right-8 bottom-6 size-24' : 'right-5 bottom-4 size-14',
        )}
        strokeWidth={1.5}
      />
      <span className="absolute top-4 left-4 rounded-lg bg-black/20 px-2.5 py-1 text-xs font-bold tracking-widest backdrop-blur-sm">
        {course.code}
      </span>
      <span className="absolute bottom-4 left-4 text-xs font-semibold tracking-wider uppercase opacity-90">
        {course.category}
      </span>
    </div>
  );
}
