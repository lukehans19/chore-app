export interface Member {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Recurrence {
  type: 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  interval: number;
  daysOfWeek: number[];
  startDate: string;
  endDate: string | null;
  monthlyPattern?: 'dayOfMonth' | 'nthWeekday' | 'lastWeekday';
  nthWeek?: number;
  weekday?: number;
}

export interface Chore {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  recurrence: Recurrence;
  createdAt: string;
}

export interface CalendarEvent {
  choreId: string;
  title: string;
  description: string;
  assigneeId: string | null;
  assigneeName: string | null;
  assigneeColor: string | null;
  date: string;
  isCompleted: boolean;
  completionId: string | null;
  completedBy: string | null;
  completedAt: string | null;
}

export interface Completion {
  id: string;
  choreId: string;
  completedBy: string;
  completedByName: string;
  scheduledDate: string;
  completedAt: string;
}

export interface Database {
  members: Member[];
  chores: Chore[];
  completions: Completion[];
}
