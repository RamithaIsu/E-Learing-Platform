import { toast } from 'sonner';
import { ApiError } from './api';

/** Shows server-side field errors next to their inputs and the summary in a toast. */
export function applyServerErrors(error, setError) {
  const details = error instanceof ApiError ? error.details.filter((detail) => detail.path) : [];
  details.forEach((detail, index) => {
    setError(
      detail.path,
      { type: 'server', message: detail.message },
      { shouldFocus: index === 0 },
    );
  });
  toast.error(error.message);
}

/** True when an API error means the record does not exist (unknown or malformed id). */
export const isNotFound = (error) => error instanceof ApiError && [400, 404].includes(error.status);
