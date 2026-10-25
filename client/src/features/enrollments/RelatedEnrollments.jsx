import { ClipboardList, Plus } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '../../components/data/DataTable';
import { ButtonLink } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState, ErrorState, LoadingRows } from '../../components/ui/States';
import { APP_CONFIG } from '../../config/app';
import { enrollments } from '../../lib/resources';
import { enrollmentColumns } from './enrollmentColumns';

/** Paginated enrollments for one course or one student, shown on detail pages. */
export function RelatedEnrollments({ filter, hide, addTo, emptyText }) {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch } = enrollments.useList({
    ...filter,
    page,
    limit: APP_CONFIG.pageSize.related,
  });

  return (
    <Card aria-labelledby="enrollments-heading">
      <CardHeader
        id="enrollments-heading"
        title="Enrollments"
        description={data ? `${data.meta.total} in total` : undefined}
        action={
          addTo && (
            <ButtonLink to={addTo} size="sm">
              <Plus /> Enroll
            </ButtonLink>
          )
        }
      />
      {isPending ? (
        <LoadingRows rows={3} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.data.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No enrollments yet" description={emptyText} />
      ) : (
        <>
          <DataTable caption="Enrollments" columns={enrollmentColumns({ hide })} rows={data.data} />
          <Pagination meta={data.meta} onPageChange={setPage} noun="enrollments" />
        </>
      )}
    </Card>
  );
}
