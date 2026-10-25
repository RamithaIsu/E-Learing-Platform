/** An error that maps directly to an HTTP response with a stable error code. */
export class HttpError extends Error {
  constructor(status, code, message, details = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (entity) => new HttpError(404, 'NOT_FOUND', `${entity} not found`);

export const conflict = (message) => new HttpError(409, 'CONFLICT', message);

/** A business rule failed for one field; the client shows the message next to that field. */
export const ruleViolation = (path, message) =>
  new HttpError(422, 'BUSINESS_RULE', message, [{ path, message }]);
