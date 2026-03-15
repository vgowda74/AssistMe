import { useState } from 'react';
import { useApp } from '../store/AppContext';
import './TasksPage.css';

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (taskDay < today) {
    return {
      text: `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — Overdue`,
      overdue: true,
    };
  }
  if (taskDay.getTime() === today.getTime()) {
    return {
      text: `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
      overdue: false,
    };
  }
  if (taskDay.getTime() === tomorrow.getTime()) {
    return { text: 'Tomorrow', overdue: false };
  }
  return {
    text: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    overdue: false,
  };
}

export default function TasksPage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const allTasks = state.notes.flatMap((note) =>
    note.tasks.map((task) => ({ ...task, noteTitle: note.title, noteId: note.id }))
  );

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);

  const filteredTasks = allTasks.filter((task) => {
    switch (activeTab) {
      case 'today': {
        if (task.completed) return false;
        if (!task.dueDate) return false;
        const d = new Date(task.dueDate);
        const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return taskDay.getTime() === today.getTime();
      }
      case 'upcoming':
        return !task.completed && task.dueDate && new Date(task.dueDate) > tomorrow;
      case 'done':
        return task.completed;
      default:
        return true;
    }
  });

  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const handleToggle = (noteId, taskId) => {
    dispatch({ type: 'TOGGLE_TASK', payload: { noteId, taskId } });
  };

  const tabs = ['All', 'Today', 'Upcoming', 'Done'];

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>Tasks</h1>
        <button className="tasks-settings">⚙️</button>
      </header>

      <div className="tasks-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tasks-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tasks-list">
        {pendingTasks.map((task) => {
          const due = formatDueDate(task.dueDate);
          return (
            <div key={task.id} className="task-item" onClick={() => handleToggle(task.noteId, task.id)}>
              <span className="task-item-checkbox" />
              <div className="task-item-info">
                <span className="task-item-text">{task.text}</span>
                <span className="task-item-source">From: {task.noteTitle}</span>
              </div>
              {due && (
                <span className={`task-item-due ${due.overdue ? 'overdue' : ''}`}>{due.text}</span>
              )}
            </div>
          );
        })}

        {completedTasks.length > 0 && (
          <>
            <div className="tasks-section-label">COMPLETED</div>
            {completedTasks.map((task) => (
              <div key={task.id} className="task-item completed" onClick={() => handleToggle(task.noteId, task.id)}>
                <span className="task-item-checkbox checked">✓</span>
                <div className="task-item-info">
                  <span className="task-item-text">{task.text}</span>
                  <span className="task-item-source">From: {task.noteTitle}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {filteredTasks.length === 0 && (
          <div className="empty-state">No tasks in this category.</div>
        )}
      </div>

      <button className="fab">+</button>
    </div>
  );
}
