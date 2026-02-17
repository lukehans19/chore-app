import { parseISO } from 'date-fns';
import type { Chore, CalendarEvent } from '../types';
import { readDb, writeDb } from './store';
import { expandChore } from '../utils/recurrence';

export function getChores(): Chore[] {
  return readDb().chores;
}

export function addChore(data: {
  title: string;
  description: string;
  assigneeId: string | null;
  recurrence: Chore['recurrence'];
}): Chore {
  const db = readDb();
  const chore: Chore = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description || '',
    assigneeId: data.assigneeId || null,
    recurrence: {
      type: data.recurrence.type || 'once',
      interval: data.recurrence.interval || 1,
      daysOfWeek: data.recurrence.daysOfWeek || [],
      startDate: data.recurrence.startDate,
      endDate: data.recurrence.endDate || null,
      monthlyPattern: data.recurrence.monthlyPattern,
      nthWeek: data.recurrence.nthWeek,
      weekday: data.recurrence.weekday,
    },
    createdAt: new Date().toISOString(),
  };
  db.chores.push(chore);
  writeDb(db);
  return chore;
}

export function editChore(
  id: string,
  data: Partial<Pick<Chore, 'title' | 'description' | 'assigneeId' | 'recurrence'>>,
): Chore | null {
  const db = readDb();
  const idx = db.chores.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const existing = db.chores[idx];
  db.chores[idx] = {
    ...existing,
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    assigneeId: data.assigneeId !== undefined ? data.assigneeId : existing.assigneeId,
    recurrence: data.recurrence
      ? {
          type: data.recurrence.type || existing.recurrence.type,
          interval: data.recurrence.interval ?? existing.recurrence.interval,
          daysOfWeek: data.recurrence.daysOfWeek ?? existing.recurrence.daysOfWeek,
          startDate: data.recurrence.startDate || existing.recurrence.startDate,
          endDate: data.recurrence.endDate !== undefined ? data.recurrence.endDate : existing.recurrence.endDate,
          monthlyPattern: data.recurrence.monthlyPattern ?? existing.recurrence.monthlyPattern,
          nthWeek: data.recurrence.nthWeek ?? existing.recurrence.nthWeek,
          weekday: data.recurrence.weekday ?? existing.recurrence.weekday,
        }
      : existing.recurrence,
  };
  writeDb(db);
  return db.chores[idx];
}

export function removeChore(id: string): void {
  const db = readDb();
  db.chores = db.chores.filter((c) => c.id !== id);
  db.completions = db.completions.filter((c) => c.choreId !== id);
  writeDb(db);
}

export function getEvents(startStr: string, endStr: string): CalendarEvent[] {
  const rangeStart = parseISO(startStr);
  const rangeEnd = parseISO(endStr);
  const db = readDb();

  const events: CalendarEvent[] = [];
  for (const chore of db.chores) {
    const dates = expandChore(chore, rangeStart, rangeEnd);
    const member = chore.assigneeId
      ? db.members.find((m) => m.id === chore.assigneeId) ?? null
      : null;

    for (const date of dates) {
      const completion = db.completions.find(
        (c) => c.choreId === chore.id && c.scheduledDate === date,
      );
      const completedByMember = completion
        ? db.members.find((m) => m.id === completion.completedBy) ?? null
        : null;

      events.push({
        choreId: chore.id,
        title: chore.title,
        description: chore.description,
        assigneeId: chore.assigneeId,
        assigneeName: member?.name ?? null,
        assigneeColor: member?.color ?? null,
        date,
        isCompleted: !!completion,
        completionId: completion?.id ?? null,
        completedBy: completedByMember?.name ?? completion?.completedByName ?? null,
        completedAt: completion?.completedAt ?? null,
      });
    }
  }

  return events;
}
