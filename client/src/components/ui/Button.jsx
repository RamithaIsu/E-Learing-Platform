import { Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { buttonClasses } from './styles';

export function Button({
  variant,
  size,
  className,
  isLoading = false,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      {...props}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading || undefined}
      className={buttonClasses({ variant, size, className })}
    >
      {isLoading && <Loader2 className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, ...props }) {
  return <Link {...props} className={buttonClasses({ variant, size, className })} />;
}
