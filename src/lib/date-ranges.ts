export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return null;
  return date;
}

export function formatIsoDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return startA <= endB && startB <= endA;
}

export function isValidStayRange(arrival: string, departure: string) {
  return Boolean(parseIsoDate(arrival) && parseIsoDate(departure) && arrival < departure);
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  if (!date) throw new Error(`Invalid ISO date: ${iso}`);
  date.setDate(date.getDate() + days);
  return formatIsoDate(date);
}

export function monthWindow(startMonth: string, count = 12) {
  const [year, month] = startMonth.split("-").map(Number);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(year, month - 1 + index, 1);
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  });
}
