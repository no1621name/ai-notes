export const formatForDatetimeLocal = (date: Date | number | string | null | undefined) => {
  if (!date) return '';

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
