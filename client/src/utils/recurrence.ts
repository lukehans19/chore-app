import {
  addDays,
  addWeeks,
  addMonths,
  getDay,
  parseISO,
  isBefore,
  isAfter,
  isEqual,
  startOfDay,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import type { Chore } from '../types';

export function expandChore(chore: Chore, rangeStart: Date, rangeEnd: Date): string[] {
  const { recurrence } = chore;
  const occurrences: string[] = [];
  const start = parseISO(recurrence.startDate);
  const end = recurrence.endDate ? parseISO(recurrence.endDate) : null;

  if (recurrence.type === 'once') {
    if (
      (isAfter(start, rangeStart) || isEqual(start, rangeStart)) &&
      (isBefore(start, rangeEnd) || isEqual(start, rangeEnd))
    ) {
      occurrences.push(recurrence.startDate);
    }
    return occurrences;
  }

  if (recurrence.type === 'daily' || recurrence.type === 'custom') {
    let cursor = start;
    while (isBefore(cursor, rangeEnd) || isEqual(cursor, rangeEnd)) {
      if (end && isAfter(cursor, end)) break;
      if (isAfter(cursor, rangeStart) || isEqual(cursor, rangeStart)) {
        occurrences.push(formatDate(cursor));
      }
      cursor = addDays(cursor, recurrence.interval);
    }
    return occurrences;
  }

  if (recurrence.type === 'weekly' || recurrence.type === 'biweekly') {
    const intervalWeeks = recurrence.type === 'biweekly' ? 2 : recurrence.interval;
    const daysOfWeek = recurrence.daysOfWeek.length > 0 ? recurrence.daysOfWeek : [getDay(start)];

    let weekStart = startOfDay(start);
    while (isBefore(weekStart, rangeEnd) || isEqual(weekStart, rangeEnd)) {
      if (end && isAfter(weekStart, end)) break;
      for (let d = 0; d < 7; d++) {
        const day = addDays(weekStart, d);
        if (end && isAfter(day, end)) break;
        if (isBefore(day, start)) continue;
        if (isAfter(day, rangeEnd)) break;
        if (daysOfWeek.includes(getDay(day))) {
          if (isAfter(day, rangeStart) || isEqual(day, rangeStart)) {
            occurrences.push(formatDate(day));
          }
        }
      }
      weekStart = addWeeks(weekStart, intervalWeeks);
    }
    return occurrences;
  }

  if (recurrence.type === 'monthly') {
    const pattern = recurrence.monthlyPattern || 'dayOfMonth';

    if (pattern === 'nthWeekday' && recurrence.nthWeek != null && recurrence.weekday != null) {
      return expandNthWeekday(start, end, rangeStart, rangeEnd, recurrence.interval, recurrence.nthWeek, recurrence.weekday);
    }

    if (pattern === 'lastWeekday' && recurrence.weekday != null) {
      return expandLastWeekday(start, end, rangeStart, rangeEnd, recurrence.interval, recurrence.weekday);
    }

    // Default: dayOfMonth
    let cursor = start;
    while (isBefore(cursor, rangeEnd) || isEqual(cursor, rangeEnd)) {
      if (end && isAfter(cursor, end)) break;
      if (isAfter(cursor, rangeStart) || isEqual(cursor, rangeStart)) {
        occurrences.push(formatDate(cursor));
      }
      cursor = addMonths(cursor, recurrence.interval);
    }
    return occurrences;
  }

  return occurrences;
}

function expandNthWeekday(
  start: Date,
  end: Date | null,
  rangeStart: Date,
  rangeEnd: Date,
  interval: number,
  nthWeek: number,
  weekday: number,
): string[] {
  const occurrences: string[] = [];
  let monthCursor = startOfMonth(start);

  while (isBefore(monthCursor, rangeEnd) || isEqual(monthCursor, rangeEnd)) {
    if (end && isAfter(monthCursor, end)) break;

    const date = getNthWeekdayOfMonth(monthCursor, nthWeek, weekday);
    if (date) {
      if (
        !isBefore(date, start) &&
        !isBefore(date, rangeStart) &&
        !isAfter(date, rangeEnd) &&
        (!end || !isAfter(date, end))
      ) {
        occurrences.push(formatDate(date));
      }
    }

    monthCursor = addMonths(monthCursor, interval);
  }

  return occurrences;
}

function expandLastWeekday(
  start: Date,
  end: Date | null,
  rangeStart: Date,
  rangeEnd: Date,
  interval: number,
  weekday: number,
): string[] {
  const occurrences: string[] = [];
  let monthCursor = startOfMonth(start);

  while (isBefore(monthCursor, rangeEnd) || isEqual(monthCursor, rangeEnd)) {
    if (end && isAfter(monthCursor, end)) break;

    const date = getLastWeekdayOfMonth(monthCursor, weekday);
    if (date) {
      if (
        !isBefore(date, start) &&
        !isBefore(date, rangeStart) &&
        !isAfter(date, rangeEnd) &&
        (!end || !isAfter(date, end))
      ) {
        occurrences.push(formatDate(date));
      }
    }

    monthCursor = addMonths(monthCursor, interval);
  }

  return occurrences;
}

function getNthWeekdayOfMonth(monthStart: Date, nth: number, weekday: number): Date | null {
  let count = 0;
  let cursor = startOfMonth(monthStart);
  const monthEndDate = endOfMonth(monthStart);

  while (!isAfter(cursor, monthEndDate)) {
    if (getDay(cursor) === weekday) {
      count++;
      if (count === nth) return cursor;
    }
    cursor = addDays(cursor, 1);
  }

  return null;
}

function getLastWeekdayOfMonth(monthStart: Date, weekday: number): Date | null {
  let cursor = endOfMonth(monthStart);

  for (let i = 0; i < 7; i++) {
    if (getDay(cursor) === weekday) return cursor;
    cursor = addDays(cursor, -1);
  }

  return null;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
