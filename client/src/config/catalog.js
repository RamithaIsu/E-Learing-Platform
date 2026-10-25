import { BarChart3, Briefcase, Code2, Languages, Palette, Sprout } from 'lucide-react';

/** Visual identity for each course category (cover gradient and icon). */
export const CATEGORY_STYLES = {
  Programming: { icon: Code2, gradient: 'from-brand-800 via-brand-600 to-brand-400' },
  'Data Science': { icon: BarChart3, gradient: 'from-indigo-800 via-indigo-600 to-sky-400' },
  Design: { icon: Palette, gradient: 'from-rose-700 via-rose-500 to-accent-300' },
  Business: { icon: Briefcase, gradient: 'from-slate-900 via-slate-700 to-slate-500' },
  Languages: { icon: Languages, gradient: 'from-accent-700 via-accent-500 to-accent-300' },
  'Personal Development': {
    icon: Sprout,
    gradient: 'from-emerald-800 via-emerald-600 to-lime-400',
  },
};

export const COURSE_STATUS_TONE = { Draft: 'neutral', Published: 'success', Archived: 'warning' };
export const ENROLLMENT_STATUS_TONE = { Active: 'info', Completed: 'success', Dropped: 'danger' };
export const LEVEL_TONE = { Beginner: 'brand', Intermediate: 'accent', Advanced: 'violet' };
