import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import './TodoList.css';

export function TodoList() {
  const { 
    tasks, 
    completedTasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    completeTask, 
    reorderTasks,
    startTimer,
    setCurrentTask,
    currentTask
  } = useApp();
  
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = () => {
    if (editingTask && editText.trim()) {
      updateTask(editingTask, { text: editText.trim() });
      setEditingTask(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  const handleStartPomodoro = (task: Task) => {
    setCurrentTask(task);
    startTimer(task.id);
  };

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h2>Tasks</h2>
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="add-task-input"
          />
          <button type="submit" className="add-task-button" disabled={!newTaskText.trim()}>
            <Plus size={20} />
          </button>
        </form>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tasks-list"
            >
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`task-item ${snapshot.isDragging ? 'dragging' : ''} ${
                          currentTask?.id === task.id ? 'active' : ''
                        }`}
                      >
                        <div {...provided.dragHandleProps} className="drag-handle">
                          ⋮⋮
                        </div>
                        
                        <div className="task-content">
                          {editingTask === task.id ? (
                            <div className="edit-form">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="edit-input"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit();
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                              />
                              <div className="edit-actions">
                                <button onClick={handleSaveEdit} className="save-button">
                                  <Check size={16} />
                                </button>
                                <button onClick={handleCancelEdit} className="cancel-button">
                                  ×
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="task-text">{task.text}</span>
                              {task.pomodorosCompleted > 0 && (
                                <span className="pomodoro-count">
                                  🍅 {task.pomodorosCompleted}
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        <div className="task-actions">
                          <button
                            onClick={() => handleStartPomodoro(task)}
                            className="pomodoro-button"
                            title="Start Pomodoro"
                          >
                            🍅
                          </button>
                          <button
                            onClick={() => handleEditTask(task)}
                            className="edit-button"
                            title="Edit task"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => completeTask(task.id)}
                            className="complete-button"
                            title="Mark as complete"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="delete-button"
                            title="Delete task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {completedTasks.length > 0 && (
        <div className="completed-section">
          <h3>Completed ({completedTasks.length})</h3>
          <div className="completed-tasks">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="completed-task"
                >
                  <span className="completed-text">{task.text}</span>
                  <span className="completion-date">
                    {task.completedAt?.toLocaleDateString()}
                  </span>
                  {task.pomodorosCompleted > 0 && (
                    <span className="pomodoro-count">
                      🍅 {task.pomodorosCompleted}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}