import { APP_CONFIG } from '../config/app';

const currency = new Intl.NumberFormat(APP_CONFIG.locale, {
  style: 'currency',
  currency: APP_CONFIG.currency,
  maximumFractionDigits: 0,
});
const dateTime = new Intl.DateTimeFormat(APP_CONFIG.locale, { dateStyle: 'medium' });
// Date-only values (birthdays) are stored at midnight UTC, so show them in UTC to keep the day.
const dateOnly = new Intl.DateTimeFormat(APP_CONFIG.locale, {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export const formatPrice = (amount) => (amount === 0 ? 'Free' : currency.format(amount));
export const formatDate = (value) => dateTime.format(new Date(value));
export const formatDateOnly = (value) => dateOnly.format(new Date(value));
export const toDateInputValue = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : '';

export const pluralize = (count, word, plural = `${word}s`) =>
  `${count} ${count === 1 ? word : plural}`;

export function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export const totalLessonMinutes = (lessons = []) =>
  lessons.reduce((sum, lesson) => sum + (Number(lesson.durationMinutes) || 0), 0);

export const initials = (name = '') =>
  name
    .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
