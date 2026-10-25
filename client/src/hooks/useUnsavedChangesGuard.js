import { useEffect } from 'react';
import { useBlocker } from 'react-router';

/**
 * Asks for confirmation before leaving a form with unsaved changes (in-app and tab close).
 * allowLeaveRef is checked at navigation time, so a redirect right after saving (including
 * a "back" navigation, which arrives asynchronously) is never blocked.
 */
export function useUnsavedChangesGuard(hasUnsavedChanges, allowLeaveRef) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges &&
      !allowLeaveRef.current &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return undefined;
    const warn = (event) => {
      if (!allowLeaveRef.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges, allowLeaveRef]);

  return blocker;
}
