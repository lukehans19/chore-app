import type { Database } from '../types';

const STORAGE_KEY = 'chore-app-data';

export function readDb(): Database {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { members: [], chores: [], completions: [] };
  return JSON.parse(raw);
}

export function writeDb(db: Database): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}
