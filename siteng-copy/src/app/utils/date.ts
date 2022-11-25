export function unixTimestampToDate(timestamp: string | number): Date {
  timestamp = Number(timestamp);
  return new Date(timestamp * 1_000);
}
export function dateToUnixTimestamp(date: Date): number {
  return Math.round(date.getTime() / 1_000);
}
