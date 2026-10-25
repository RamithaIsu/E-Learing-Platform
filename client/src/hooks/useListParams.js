import { useSearchParams } from 'react-router';

/**
 * List state (search, filters, sort, page) kept in the URL, so it survives refresh,
 * works with the back button and can be shared as a link.
 */
export function useListParams(defaults) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(
    Object.keys(defaults).map((key) => [key, searchParams.get(key) ?? defaults[key]]),
  );

  const update = (changes) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        for (const [key, value] of Object.entries(changes)) {
          if (value === '' || value == null || String(value) === String(defaults[key]))
            next.delete(key);
          else next.set(key, String(value));
        }
        // Any change other than paging starts again from the first page.
        if (!('page' in changes)) next.delete('page');
        return next;
      },
      { replace: true },
    );

  return [params, update];
}
