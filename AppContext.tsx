import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Task, PomodoroSession, Settings } from '../types';
import { generateId, playNotificationSound } from '../utils/helpers';

interface AppContextType extends AppState {
  addTask: (text: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  startTimer: (taskId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setCurrentTask: (task: Task | null) => void;
}

type AppAction =
  | { type: 'ADD_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'REORDER_TASKS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'START_TIMER'; payload?: string }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_CURRENT_TASK'; payload: Task | null }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const defaultSettings: Settings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  autoStartBreak: true,
  autoStartWork: false,
  theme: 'tomato',
  soundEnabled: true,
  notificationsEnabled: true,
};

const initialState: AppState = {
  tasks: [],
  completedTasks: [],
  currentTask: null,
  isTimerActive: false,
  timeRemaining: 25 * 60, // 25 minutes in seconds
  currentSession: null,
  sessionsToday: [],
  settings: defaultSettings,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        id: generateId(),
        text: action.payload,
        completed: false,
        createdAt: new Date(),
        pomodorosCompleted: 0,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
      };

    case 'COMPLETE_TASK':
      const taskToComplete = state.tasks.find(task => task.id === action.payload);
      if (!taskToComplete) return state;

      const completedTask = {
        ...taskToComplete,
        completed: true,
        completedAt: new Date(),
      };

      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        completedTasks: [...state.completedTasks, completedTask],
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
      };

    case 'REORDER_TASKS':
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.tasks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        ...state,
        tasks: result,
      };

    case 'START_TIMER':
      const session: PomodoroSession = {
        id: generateId(),
        taskId: action.payload,
        startTime: new Date(),
        duration: state.settings.workDuration * 60,
        type: 'work',
        completed: false,
      };
      return {
        ...state,
        isTimerActive: true,
        timeRemaining: state.settings.workDuration * 60,
        currentSession: session,
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        isTimerActive: false,
      };

    case 'RESET_TIMER':
      return {
        ...state,
        isTimerActive: false,
        timeRemaining: state.settings.workDuration * 60,
        currentSession: null,
      };

    case 'TICK_TIMER':
      if (state.timeRemaining <= 1) {
        return {
          ...state,
          timeRemaining: 0,
          isTimerActive: false,
        };
      }
      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
      };

    case 'COMPLETE_SESSION':
      if (!state.currentSession) return state;

      const completedSession = {
        ...state.currentSession,
        endTime: new Date(),
        completed: true,
      };

      // Update task pomodoro count if it was a work session
      let updatedTasks = state.tasks;
      if (completedSession.type === 'work' && completedSession.taskId) {
        updatedTasks = state.tasks.map(task =>
          task.id === completedSession.taskId
            ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
            : task
        );
      }

      return {
        ...state,
        tasks: updatedTasks,
        sessionsToday: [...state.sessionsToday, completedSession],
        currentSession: null,
        timeRemaining: state.settings.workDuration * 60,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
        timeRemaining: state.isTimerActive 
          ? state.timeRemaining 
          : (action.payload.workDuration || state.settings.workDuration) * 60,
      };

    case 'SET_CURRENT_TASK':
      return {
        ...state,
        currentTask: action.payload,
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('pomodoroTodoState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        if (parsedState.tasks) {
          parsedState.tasks = parsedState.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          }));
        }
        if (parsedState.completedTasks) {
          parsedState.completedTasks = parsedState.completedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          }));
        }
        if (parsedState.sessionsToday) {
          parsedState.sessionsToday = parsedState.sessionsToday.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
          }));
        }
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoroTodoState', JSON.stringify(state));
  }, [state]);

  // Timer tick effect
  useEffect(() => {
    if (state.isTimerActive && state.timeRemaining > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
      return () => clearInterval(interval);
    } else if (state.timeRemaining === 0 && state.currentSession) {
      dispatch({ type: 'COMPLETE_SESSION' });
      if (state.settings.soundEnabled) {
        playNotificationSound();
      }
    }
  }, [state.isTimerActive, state.timeRemaining, state.currentSession, state.settings.soundEnabled]);

  const contextValue: AppContextType = {
    ...state,
    addTask: (text: string) => dispatch({ type: 'ADD_TASK', payload: text }),
    updateTask: (id: string, updates: Partial<Task>) => 
      dispatch({ type: 'UPDATE_TASK', payload: { id, updates } }),
    deleteTask: (id: string) => dispatch({ type: 'DELETE_TASK', payload: id }),
    completeTask: (id: string) => dispatch({ type: 'COMPLETE_TASK', payload: id }),
    reorderTasks: (startIndex: number, endIndex: number) => 
      dispatch({ type: 'REORDER_TASKS', payload: { startIndex, endIndex } }),
    startTimer: (taskId?: string) => dispatch({ type: 'START_TIMER', payload: taskId }),
    pauseTimer: () => dispatch({ type: 'PAUSE_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    updateSettings: (settings: Partial<Settings>) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    setCurrentTask: (task: Task | null) => 
      dispatch({ type: 'SET_CURRENT_TASK', payload: task }),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}