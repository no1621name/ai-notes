export function formatDate(
  date: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
  locale: string | string[] = 'en-US',
): string | null {
  if (!date) return null;

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(d);
}

export const DateFormat = {
  SHORT: { month: 'short', day: 'numeric', year: 'numeric' } as const,
  LONG: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } as const,
  WITH_TIME: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const,
} as const;
