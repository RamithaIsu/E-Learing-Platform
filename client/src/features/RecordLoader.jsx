import { Card } from '../components/ui/Card';
import { ErrorState, PageLoading } from '../components/ui/States';
import { isNotFound } from '../lib/form';
import { NotFoundPage } from './ErrorPages';

/**
 * Loads one record by id and renders children(record) once ready, with loading,
 * not-found and error states. Without an id (a "new" form) it renders children(undefined).
 */
export function RecordLoader({ resource, id, entityLabel, backTo, children }) {
  const query = resource.useOne(id);
  if (!id) return children(undefined);
  if (query.isPending) return <PageLoading />;

  if (query.isError) {
    const noun = entityLabel.toLowerCase();
    return isNotFound(query.error) ? (
      <NotFoundPage
        title={`${entityLabel} not found`}
        description={`This ${noun} does not exist or has been deleted.`}
        backTo={backTo}
        backLabel={`Back to ${noun}s`}
      />
    ) : (
      <Card>
        <ErrorState error={query.error} onRetry={query.refetch} />
      </Card>
    );
  }
  return children(query.data);
}
