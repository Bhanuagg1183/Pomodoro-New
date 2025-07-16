import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useKeyboardShortcuts() {
  const { isTimerActive, pauseTimer, startTimer, tasks, currentTask } = useApp();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (isTimerActive) {
            pauseTimer();
          } else if (currentTask) {
            startTimer(currentTask.id);
          }
          break;
        case 'KeyN':
          event.preventDefault();
          // Focus on next task or first task if none selected
          if (tasks.length > 0) {
            const currentIndex = currentTask ? tasks.findIndex(t => t.id === currentTask.id) : -1;
            const nextIndex = (currentIndex + 1) % tasks.length;
            const nextTask = tasks[nextIndex];
            // This would need to be implemented in the context
            // setCurrentTask(nextTask);
          }
          break;
        case 'KeyS':
          event.preventDefault();
          // This would trigger opening settings modal
          // You'd need to implement this through a callback prop or context
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTimerActive, pauseTimer, startTimer, tasks, currentTask]);
}