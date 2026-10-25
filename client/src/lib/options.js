/** Builds Select options from a list of plain strings. */
export const toOptions = (values) => values.map((value) => ({ value, label: value }));
