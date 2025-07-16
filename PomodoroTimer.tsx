import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Minus, X, Coffee } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTime } from '../../utils/helpers';
import './PomodoroTimer.css';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PomodoroTimer({ isOpen, onClose }: PomodoroTimerProps) {
  const {
    isTimerActive,
    timeRemaining,
    currentTask,
    currentSession,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
  } = useApp();

  const [customDuration, setCustomDuration] = useState(settings.workDuration);
  const [isBreakMode, setIsBreakMode] = useState(false);

  const progress = currentSession 
    ? (1 - timeRemaining / (currentSession.duration)) * 100
    : 0;

  const circumference = 2 * Math.PI * 90; // radius of 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleStart = () => {
    if (currentTask) {
      startTimer(currentTask.id);
    }
  };

  const handleDurationChange = (change: number) => {
    const newDuration = Math.max(1, Math.min(60, customDuration + change));
    setCustomDuration(newDuration);
    updateSettings({ workDuration: newDuration });
  };

  const startBreak = () => {
    setIsBreakMode(true);
    // Start break timer logic would go here
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="timer-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="timer-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="timer-content">
            {isBreakMode ? (
              <div className="break-timer">
                <div className="break-icon">
                  <Coffee size={48} />
                </div>
                <h2>Break Time!</h2>
                <p>Take a well-deserved break</p>
                <div className="break-duration">
                  {formatTime(settings.breakDuration * 60)}
                </div>
              </div>
            ) : (
              <>
                <div className="timer-header">
                  <h2>Pomodoro Timer</h2>
                  {currentTask && (
                    <p className="current-task">
                      Working on: <strong>{currentTask.text}</strong>
                    </p>
                  )}
                </div>

                <div className="tomato-timer">
                  <svg className="timer-circle" viewBox="0 0 200 200">
                    {/* Tomato shape background */}
                    <defs>
                      <radialGradient id="tomatoGradient" cx="0.3" cy="0.3">
                        <stop offset="0%" stopColor="#ff6b6b" />
                        <stop offset="70%" stopColor="#e53e3e" />
                        <stop offset="100%" stopColor="#c53030" />
                      </radialGradient>
                      <filter id="shadow">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    
                    {/* Tomato body */}
                    <circle
                      cx="100"
                      cy="110"
                      r="85"
                      fill="url(#tomatoGradient)"
                      filter="url(#shadow)"
                    />
                    
                    {/* Tomato stem */}
                    <path
                      d="M85 35 Q90 25 95 35 Q100 25 105 35 Q110 25 115 35"
                      stroke="#22c55e"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="100"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.8)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 100 110)"
                      className="progress-circle"
                    />
                  </svg>
                  
                  <div className="timer-display">
                    <div className="time-text">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                <div className="timer-controls">
                  <div className="duration-controls">
                    <button
                      onClick={() => handleDurationChange(-5)}
                      className="duration-button"
                      disabled={isTimerActive}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="duration-display">
                      {customDuration} min
                    </span>
                    <button
                      onClick={() => handleDurationChange(5)}
                      className="duration-button"
                      disabled={isTimerActive}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="action-controls">
                    <button
                      onClick={resetTimer}
                      className="control-button reset-button"
                      disabled={!currentSession}
                    >
                      <RotateCcw size={20} />
                    </button>
                    
                    <button
                      onClick={isTimerActive ? pauseTimer : handleStart}
                      className="control-button play-button"
                      disabled={!currentTask}
                    >
                      {isTimerActive ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                  </div>
                </div>

                {timeRemaining === 0 && currentSession && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="session-complete"
                  >
                    <h3>Pomodoro Complete! 🎉</h3>
                    <p>Great work! Time for a break.</p>
                    <button onClick={startBreak} className="break-button">
                      Start Break <Coffee size={16} />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}