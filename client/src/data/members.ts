import type { Member } from '../types';
import { readDb, writeDb } from './store';

export function getMembers(): Member[] {
  return readDb().members;
}

export function addMember(name: string, color: string): Member {
  const db = readDb();
  const member: Member = {
    id: crypto.randomUUID(),
    name,
    color,
    createdAt: new Date().toISOString(),
  };
  db.members.push(member);
  writeDb(db);
  return member;
}

export function removeMember(id: string): void {
  const db = readDb();
  db.members = db.members.filter((m) => m.id !== id);
  for (const chore of db.chores) {
    if (chore.assigneeId === id) {
      chore.assigneeId = null;
    }
  }
  writeDb(db);
}
