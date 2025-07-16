import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Play, BarChart3 } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { TodoList } from './components/TodoList/TodoList';
import { PomodoroTimer } from './components/PomodoroTimer/PomodoroTimer';
import { ProgressDashboard } from './components/ProgressDashboard/ProgressDashboard';
import { Settings } from './components/Settings/Settings';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { requestNotificationPermission } from './utils/helpers';
import './App.css';

function AppContent() {
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'dashboard'>('tasks');

  useKeyboardShortcuts();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="header-content"
        >
          <div className="logo">
            <span className="logo-icon">🍅</span>
            <h1>PomodoroTodo</h1>
          </div>
          
          <nav className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <Play size={16} />
              Tasks
            </button>
            <button
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={16} />
              Progress
            </button>
          </nav>

          <div className="header-actions">
            <button
              className="timer-toggle"
              onClick={() => setIsTimerOpen(true)}
              title="Open Pomodoro Timer (Space)"
            >
              🍅 Timer
            </button>
            <button
              className="settings-button"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings (S)"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </motion.div>
      </header>

      <main className="app-main">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="main-content"
        >
          {activeTab === 'tasks' ? <TodoList /> : <ProgressDashboard />}
        </motion.div>
      </main>

      <PomodoroTimer 
        isOpen={isTimerOpen} 
        onClose={() => setIsTimerOpen(false)} 
      />
      
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <div className="keyboard-shortcuts">
        <p>
          <kbd>Space</kbd> Start/Pause • <kbd>N</kbd> Next Task • <kbd>S</kbd> Settings
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;