import type { Completion } from '../types';
import { readDb, writeDb } from './store';

export function getCompletions(choreId?: string): Completion[] {
  const db = readDb();
  if (choreId) {
    return db.completions.filter((c) => c.choreId === choreId);
  }
  return db.completions;
}

export function addCompletion(data: {
  choreId: string;
  completedBy: string;
  scheduledDate: string;
}): Completion {
  const db = readDb();
  const member = db.members.find((m) => m.id === data.completedBy);
  const completion: Completion = {
    id: crypto.randomUUID(),
    choreId: data.choreId,
    completedBy: data.completedBy,
    completedByName: member?.name ?? 'Unknown',
    scheduledDate: data.scheduledDate,
    completedAt: new Date().toISOString(),
  };
  db.completions.push(completion);
  writeDb(db);
  return completion;
}

export function removeCompletion(id: string): void {
  const db = readDb();
  db.completions = db.completions.filter((c) => c.id !== id);
  writeDb(db);
}
