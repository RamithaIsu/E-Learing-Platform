import { z } from 'zod';
import { LIMITS, OBJECT_ID_PATTERN } from '@learnsphere/shared';

export const objectIdFilter = z.string().regex(OBJECT_ID_PATTERN, 'Invalid id');

/** Query-string schema for list endpoints: paging, search, an allow-listed sort and filters. */
export function listQuerySchema({ sortFields, defaultSort, defaultOrder = 'asc', filters = {} }) {
  return z.strictObject({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(LIMITS.pageSize.max).default(LIMITS.pageSize.default),
    search: z.string().trim().max(LIMITS.search.max).optional(),
    sort: z.enum(sortFields).default(defaultSort),
    order: z.enum(['asc', 'desc']).default(defaultOrder),
    ...filters,
  });
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Case-insensitive "contains" match across fields; input is escaped so it is never a pattern. */
export function searchFilter(search, fields) {
  if (!search) return {};
  const pattern = new RegExp(escapeRegex(search), 'i');
  return { $or: fields.map((field) => ({ [field]: pattern })) };
}

/** Runs a paginated, sorted find plus a total count. */
export async function paginate(Model, filter, { page, limit, sort, order }, populate = []) {
  const [data, total] = await Promise.all([
    Model.find(filter)
      .sort({ [sort]: order === 'asc' ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populate)
      .lean(),
    Model.countDocuments(filter),
  ]);
  return { data, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

/** Counts documents per referenced id in one aggregation (avoids one query per row). */
export async function countBy(Model, field, ids, match = {}) {
  const rows = await Model.aggregate([
    { $match: { [field]: { $in: ids }, ...match } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [String(row._id), row.count]));
}
