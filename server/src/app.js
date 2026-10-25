import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { HTTP_LIMITS } from './config/http.js';
import { errorHandler, notFoundHandler, requestId } from './middleware/error-handler.js';
import { courseRouter } from './modules/courses/course.routes.js';
import { enrollmentRouter } from './modules/enrollments/enrollment.routes.js';
import { instructorRouter } from './modules/instructors/instructor.routes.js';
import { statsRouter } from './modules/stats/stats.routes.js';
import { studentRouter } from './modules/students/student.routes.js';

/** Creates the Express app without starting it, so tests can drive it directly. */
export function createApp({ corsOrigins }) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigins }));
  app.use(requestId);
  app.use(express.json({ limit: HTTP_LIMITS.bodySize }));
  app.use(
    '/api',
    rateLimit({
      windowMs: HTTP_LIMITS.rateLimitWindowMs,
      limit: HTTP_LIMITS.rateLimitMaxRequests,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' } },
    }),
  );

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/stats', statsRouter);
  app.use('/api/instructors', instructorRouter);
  app.use('/api/courses', courseRouter);
  app.use('/api/students', studentRouter);
  app.use('/api/enrollments', enrollmentRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
