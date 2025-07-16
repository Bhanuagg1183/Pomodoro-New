export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  pomodorosCompleted: number;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'work' | 'break';
  completed: boolean;
}

export interface Settings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  autoStartBreak: boolean;
  autoStartWork: boolean;
  theme: 'tomato' | 'mint' | 'midnight';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface AppState {
  tasks: Task[];
  completedTasks: Task[];
  currentTask: Task | null;
  isTimerActive: boolean;
  timeRemaining: number;
  currentSession: PomodoroSession | null;
  sessionsToday: PomodoroSession[];
  settings: Settings;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';
export type SessionType = 'work' | 'break' | 'longBreak';