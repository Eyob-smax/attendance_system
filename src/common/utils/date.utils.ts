import { DateTime } from 'luxon';
import { toGregorian, toEthiopian } from 'ethiopian-calendar-new';

export const ET_ZONE = 'Africa/Addis_Ababa';

const ET_MONTH_NAMES = [
  '',
  'Meskerem',
  'Tikimt',
  'Hidar',
  'Tahsas',
  'Tir',
  'Yekatit',
  'Megabit',
  'Miazia',
  'Ginbot',
  'Sene',
  'Hamle',
  'Nehase',
  'Pagume',
] as const;

function parseEthiopianDate(etDateStr: string): {
  year: number;
  month: number;
  day: number;
} {
  const parts = etDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(
      'Invalid Ethiopian date format. Expected: YYYY-MM-DD (e.g., 2018-02-23)',
    );
  }
  const [year, month, day] = parts;
  if (month < 1 || month > 13) throw new Error('Ethiopian month must be 1–13');
  if (day < 1 || day > 30)
    throw new Error('Ethiopian day must be 1–30 (or 5–6 for Pagume)');
  return { year, month, day };
}

export function ethiopianToUTC(etDateStr: string): Date {
  const { year, month, day } = parseEthiopianDate(etDateStr);

  const gregorian = toGregorian(year, month, day);

  return DateTime.fromObject(
    {
      year: gregorian.year,
      month: gregorian.month,
      day: gregorian.day,
    },
    { zone: ET_ZONE },
  )
    .startOf('day')
    .toUTC()
    .toJSDate();
}

export function utcToEthiopianFormatted(utcDate: Date | null): string | null {
  if (!utcDate) return null;

  const dt = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(ET_ZONE);
  const et = toEthiopian(dt.year, dt.month, dt.day);

  const monthName = ET_MONTH_NAMES[et.month];
  if (!monthName) throw new Error(`Invalid Ethiopian month: ${et.month}`);

  return `${monthName} ${et.day}, ${et.year} E.C.`;
}

export function utcToEthiopianNumerical(utcDate: Date | null): string | null {
  if (!utcDate) return null;

  const dt = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(ET_ZONE);
  const et = toEthiopian(dt.year, dt.month, dt.day);

  return `${et.year.toString().padStart(4, '0')}-${et.month
    .toString()
    .padStart(2, '0')}-${et.day.toString().padStart(2, '0')}`;
}

export function formatTimeInET(utcTime: Date | null): string | null {
  if (!utcTime) return null;
  return DateTime.fromJSDate(utcTime, { zone: 'utc' })
    .setZone(ET_ZONE)
    .toFormat('HH:mm');
}

export function nowInEthiopian(): string {
  const now = DateTime.now().setZone(ET_ZONE);
  const et = toEthiopian(now.year, now.month, now.day);
  const monthName = ET_MONTH_NAMES[et.month];
  return `${monthName} ${et.day}, ${et.year} E.C.`;
}

export function nowInEthiopianNumerical(): string {
  const now = DateTime.now().setZone(ET_ZONE);
  const et = toEthiopian(now.year, now.month, now.day);
  return `${et.year}-${et.month.toString().padStart(2, '0')}-${et.day
    .toString()
    .padStart(2, '0')}`;
}
