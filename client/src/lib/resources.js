import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

/**
 * TanStack Query hooks for one REST resource. Every write refreshes all cached queries
 * because deletes cascade across resources (a deleted course also removes its enrollments).
 */
function createResource(path) {
  const base = `/${path}`;

  function useWrite(mutationFn, { beforeInvalidate } = {}) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn,
      onSuccess: (_data, variables) => {
        beforeInvalidate?.(queryClient, variables);
        return queryClient.invalidateQueries();
      },
    });
  }

  return {
    useList: (params, options = {}) =>
      useQuery({
        queryKey: [path, 'list', params],
        queryFn: () => api.get(base, params),
        placeholderData: keepPreviousData,
        ...options,
      }),
    useOne: (id) =>
      useQuery({
        queryKey: [path, 'detail', id],
        queryFn: () => api.get(`${base}/${id}`).then((response) => response.data),
        enabled: Boolean(id),
      }),
    useCreate: () => useWrite((body) => api.post(base, body).then((response) => response.data)),
    useUpdate: (id) =>
      useWrite((body) => api.put(`${base}/${id}`, body).then((response) => response.data)),
    // The deleted record's own detail query is dropped so it is not refetched into a 404.
    useRemove: () =>
      useWrite((id) => api.delete(`${base}/${id}`), {
        beforeInvalidate: (queryClient, id) =>
          queryClient.removeQueries({ queryKey: [path, 'detail', id] }),
      }),
  };
}

export const courses = createResource('courses');
export const instructors = createResource('instructors');
export const students = createResource('students');
export const enrollments = createResource('enrollments');

export const useStats = () =>
  useQuery({ queryKey: ['stats'], queryFn: () => api.get('/stats').then((r) => r.data) });
