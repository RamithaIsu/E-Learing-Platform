import { OBJECT_ID_PATTERN } from '@learnsphere/shared';
import { HttpError } from '../lib/http-error.js';

const toDetails = (error) =>
  error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));

/** Validates req[source] with a zod schema and stores the parsed result on req.validated. */
export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      return next(
        new HttpError(
          400,
          'VALIDATION_ERROR',
          'Please correct the highlighted fields',
          toDetails(result.error),
        ),
      );
    }
    req.validated = { ...req.validated, [source]: result.data };
    next();
  };

export function validateObjectId(_req, _res, next, id) {
  if (!OBJECT_ID_PATTERN.test(id))
    return next(new HttpError(400, 'INVALID_ID', 'Invalid record id'));
  next();
}
