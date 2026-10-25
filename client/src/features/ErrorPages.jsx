import { Compass, TriangleAlert } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/States';

export function NotFoundPage({
  title = 'Page not found',
  description = 'The page you are looking for does not exist or may have been moved.',
  backTo = '/',
  backLabel = 'Back to dashboard',
}) {
  return (
    <Card>
      <title>{title}</title>
      <EmptyState
        icon={Compass}
        title={title}
        description={description}
        action={<ButtonLink to={backTo}>{backLabel}</ButtonLink>}
      />
    </Card>
  );
}

export function RouteErrorPage() {
  return (
    <div className="grid min-h-dvh place-items-center p-4">
      <Card className="w-full max-w-lg">
        <EmptyState
          icon={TriangleAlert}
          title="Something went wrong"
          description="An unexpected error occurred while showing this page. Please try again."
          action={
            <ButtonLink to="/" reloadDocument>
              Reload the app
            </ButtonLink>
          }
        />
      </Card>
    </div>
  );
}
