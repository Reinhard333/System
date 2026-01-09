
export type Section = 'HOME' | 'TASKS' | 'STREAKS' | 'TIMELINE' | 'XP';

export interface Task {
  id: string;
  label: string;
  completed: boolean;
}

export interface UserState {
  tasks: Task[];
  streak: number;
  xp: number;
  lastLoginDate: string; // ISO format
}
