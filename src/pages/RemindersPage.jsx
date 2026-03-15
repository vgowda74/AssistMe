import { useState } from 'react';
import { useApp } from '../store/AppContext';
import './RemindersPage.css';

function formatReminderDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (taskDay.getTime() === today.getTime()) return `Today at ${time}`;
  if (taskDay.getTime() === tomorrow.getTime()) return `Tomorrow at ${time}`;
  if (taskDay < today) {
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${time} — Overdue`;
  }
  return `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${time}`;
}

function isOverdue(dateStr) {
  return new Date(dateStr) < new Date();
}

export default function RemindersPage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');

  const reminders = state.notes
    .filter((n) => n.reminder)
    .map((n) => ({
      noteId: n.id,
      title: n.title,
      noteTitle: n.title,
      date: n.reminder.date,
      completed: n.reminder.completed,
      overdue: !n.reminder.completed && isOverdue(n.reminder.date),
    }));

  const filtered = reminders.filter((r) => {
    switch (activeTab) {
      case 'upcoming':
        return !r.completed && !r.overdue;
      case 'overdue':
        return !r.completed && r.overdue;
      case 'completed':
        return r.completed;
      default:
        return true;
    }
  });

  const handleComplete = (noteId) => {
    dispatch({ type: 'COMPLETE_REMINDER', payload: noteId });
  };

  const tabs = ['Upcoming', 'Overdue', 'Completed'];

  return (
    <div className="reminders-page">
      <header className="reminders-header">
        <h1>Reminders</h1>
        <button className="reminders-add">+</button>
      </header>

      <div className="reminders-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`reminders-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="reminders-list">
        {filtered.map((reminder) => (
          <div
            key={reminder.noteId}
            className={`reminder-item ${reminder.overdue ? 'overdue' : ''}`}
            onClick={() => !reminder.completed && handleComplete(reminder.noteId)}
          >
            <span className={`reminder-dot ${reminder.overdue ? 'overdue' : ''}`} />
            <div className="reminder-info">
              <span className="reminder-title">{reminder.title}</span>
              <span className="reminder-note">{reminder.noteTitle} note</span>
              <span className={`reminder-date ${reminder.overdue ? 'overdue' : ''}`}>
                {formatReminderDate(reminder.date)}
              </span>
            </div>
            <span className="reminder-bell">🔔</span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">No reminders in this category.</div>
        )}
      </div>
    </div>
  );
}
