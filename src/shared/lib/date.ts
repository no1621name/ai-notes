export const formatForDatetimeLocal = (date: Date | number | string | null | undefined) => {
  if (!date) return '';

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  return d.toISOString().slice(0, 16);
};
