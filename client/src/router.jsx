import { createBrowserRouter } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { NotFoundPage, RouteErrorPage } from './features/ErrorPages';

/** Each page is its own chunk, loaded when first visited. */
const page = (load) => ({
  lazy: async () => ({ Component: (await load()).default }),
});

const resourceRoutes = (path, { List, Detail, Form }) => ({
  path,
  children: [
    { index: true, ...page(List) },
    { path: 'new', ...page(Form) },
    ...(Detail ? [{ path: ':id', ...page(Detail) }] : []),
    { path: ':id/edit', ...page(Form) },
  ],
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, ...page(() => import('./features/dashboard/DashboardPage')) },
      resourceRoutes('courses', {
        List: () => import('./features/courses/CourseListPage'),
        Detail: () => import('./features/courses/CourseDetailPage'),
        Form: () => import('./features/courses/CourseFormPage'),
      }),
      resourceRoutes('instructors', {
        List: () => import('./features/instructors/InstructorListPage'),
        Detail: () => import('./features/instructors/InstructorDetailPage'),
        Form: () => import('./features/instructors/InstructorFormPage'),
      }),
      resourceRoutes('students', {
        List: () => import('./features/students/StudentListPage'),
        Detail: () => import('./features/students/StudentDetailPage'),
        Form: () => import('./features/students/StudentFormPage'),
      }),
      resourceRoutes('enrollments', {
        List: () => import('./features/enrollments/EnrollmentListPage'),
        Form: () => import('./features/enrollments/EnrollmentFormPage'),
      }),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
