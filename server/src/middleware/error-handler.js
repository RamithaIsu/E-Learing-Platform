import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { HttpError } from '../lib/http-error.js';

const DUPLICATE_MESSAGES = {
  email: 'This email address is already registered',
  code: 'This course code is already in use',
  student: 'This student is already enrolled in this course',
};
// The compound unique index on enrollments reports "student"; the form shows it under "course".
const DUPLICATE_FIELD_ALIASES = { student: 'course' };

export function requestId(req, res, next) {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}

export function notFoundHandler(req, _res, next) {
  next(new HttpError(404, 'ROUTE_NOT_FOUND', `Route ${req.method} ${req.path} not found`));
}

function toHttpError(err) {
  if (err instanceof HttpError) return err;

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'value';
    const message = DUPLICATE_MESSAGES[field] ?? 'This record already exists';
    const path = DUPLICATE_FIELD_ALIASES[field] ?? field;
    return new HttpError(409, 'DUPLICATE', message, [{ path, message }]);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
    return new HttpError(400, 'VALIDATION_ERROR', 'Please correct the highlighted fields', details);
  }
  if (err?.type === 'entity.parse.failed') {
    return new HttpError(400, 'MALFORMED_JSON', 'The request body is not valid JSON');
  }
  if (err?.type === 'entity.too.large') {
    return new HttpError(413, 'PAYLOAD_TOO_LARGE', 'The request body is too large');
  }
  return null;
}

/**
 * Sends a safe error body to the client; unexpected errors are logged with the request id only.
 * Express recognises error handlers by their four arguments, so _next must stay.
 */
export function errorHandler(err, req, res, _next) {
  const httpError = toHttpError(err);
  if (!httpError) console.error(`[${req.id}] Unhandled error:`, err);

  const { status, code, message, details } =
    httpError ?? new HttpError(500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.');
  res.status(status).json({ error: { code, message, details, requestId: req.id } });
}
