import { cn } from '../../lib/cn';

/**
 * A table when its container is wide enough, stacked cards otherwise (phones, narrow columns).
 * Columns: { key, header, render(row), primary?, align?, className? }. The primary column
 * becomes the card title on small screens.
 */
export function DataTable({ columns, rows, caption, rowKey = (row) => row._id }) {
  return (
    <div className="@container">
      <div className="hidden overflow-x-auto @4xl:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-line bg-surface-muted text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-5 py-3 font-semibold',
                    column.align === 'right' && 'text-right',
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-brand-50/40">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-5 py-3.5 align-middle',
                      column.align === 'right' && 'text-right',
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line @4xl:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={rowKey(row)} className="space-y-3 px-4 py-4">
            {columns.map((column) =>
              column.primary ? (
                <div key={column.key}>{column.render(row)}</div>
              ) : (
                <div key={column.key} className="flex items-center justify-between gap-4 text-sm">
                  <span className="shrink-0 text-ink-muted">{column.header}</span>
                  <div className="flex min-w-0 justify-end text-right">{column.render(row)}</div>
                </div>
              ),
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
