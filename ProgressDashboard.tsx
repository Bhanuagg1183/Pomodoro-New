import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Timer, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isToday } from '../../utils/helpers';
import './ProgressDashboard.css';

export function ProgressDashboard() {
  const { tasks, completedTasks, sessionsToday } = useApp();

  const todaysSessions = sessionsToday.filter(session => 
    isToday(session.startTime) && session.completed
  );
  
  const workSessionsToday = todaysSessions.filter(session => session.type === 'work');
  const totalPomodoros = workSessionsToday.length;
  const completedToday = completedTasks.filter(task => 
    task.completedAt && isToday(task.completedAt)
  ).length;
  
  const totalTasks = tasks.length + completedToday;
  const completionRate = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;

  const stats = [
    {
      label: 'Tasks Today',
      value: `${completedToday}/${totalTasks}`,
      icon: Target,
      color: '#e53e3e',
      progress: completionRate,
    },
    {
      label: 'Pomodoros',
      value: totalPomodoros,
      icon: Timer,
      color: '#f59e0b',
      progress: (totalPomodoros / 8) * 100, // Assuming 8 pomodoros is the daily goal
    },
    {
      label: 'Focus Time',
      value: `${Math.round(totalPomodoros * 25)}m`,
      icon: TrendingUp,
      color: '#10b981',
      progress: (totalPomodoros * 25 / 200) * 100, // Assuming 200 minutes is the daily goal
    },
    {
      label: 'Streak',
      value: '3 days', // This would be calculated based on historical data
      icon: Calendar,
      color: '#8b5cf6',
      progress: 75,
    },
  ];

  return (
    <div className="progress-dashboard">
      <h2>Today's Progress</h2>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <stat.icon size={20} />
              </div>
              <span className="stat-label">{stat.label}</span>
            </div>
            
            <div className="stat-value">{stat.value}</div>
            
            <div className="stat-progress">
              <div 
                className="progress-bar"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <motion.div
                  className="progress-fill"
                  style={{ backgroundColor: stat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stat.progress, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <span className="progress-text">{Math.round(stat.progress)}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="weekly-overview">
        <h3>This Week</h3>
        <div className="week-chart">
          {Array.from({ length: 7 }, (_, i) => {
            const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
            const height = Math.random() * 60 + 20; // Mock data
            
            return (
              <motion.div
                key={day}
                className="day-bar"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="bar-fill" style={{ backgroundColor: '#e53e3e' }} />
                <span className="day-label">{day}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}