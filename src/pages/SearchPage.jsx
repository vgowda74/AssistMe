import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import './SearchPage.css';

export default function SearchPage() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedNotes = q
    ? state.notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    : [];

  const matchedTasks = q
    ? state.notes.flatMap((n) =>
        n.tasks
          .filter((t) => t.text.toLowerCase().includes(q))
          .map((t) => ({ ...t, noteTitle: n.title, noteId: n.id }))
      )
    : [];

  const matchedReminders = q
    ? state.notes
        .filter((n) => n.reminder && n.title.toLowerCase().includes(q))
        .map((n) => ({
          noteId: n.id,
          title: n.title,
          date: n.reminder.date,
        }))
    : [];

  function highlightMatch(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="search-highlight">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    if (d.toDateString() === now.toDateString()) {
      return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (d.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="search-page">
      <div className="search-page-bar">
        <span className="search-page-icon">🔍</span>
        <input
          className="search-page-input"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button className="search-cancel" onClick={() => navigate('/')}>Cancel</button>
      </div>

      {q && (
        <div className="search-results">
          {matchedNotes.length > 0 && (
            <div className="search-section">
              <div className="search-section-label">NOTES</div>
              {matchedNotes.map((note) => (
                <div key={note.id} className="search-result-card">
                  <div className="search-result-title">{highlightMatch(note.title, q)}</div>
                  {note.content && (
                    <div className="search-result-desc">{highlightMatch(note.content.slice(0, 80), q)}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {matchedTasks.length > 0 && (
            <div className="search-section">
              <div className="search-section-label">TASKS</div>
              {matchedTasks.map((task) => (
                <div key={task.id} className="search-result-card">
                  <div className="search-result-row">
                    <span className="search-task-checkbox" />
                    <div>
                      <div className="search-result-title">{highlightMatch(task.text, q)}</div>
                      {task.dueDate && (
                        <div className="search-result-desc">{formatDate(task.dueDate)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {matchedReminders.length > 0 && (
            <div className="search-section">
              <div className="search-section-label">REMINDERS</div>
              {matchedReminders.map((r) => (
                <div key={r.noteId} className="search-result-card">
                  <div className="search-result-row">
                    <span className="search-reminder-dot" />
                    <div>
                      <div className="search-result-title">{highlightMatch(r.title, q)}</div>
                      <div className="search-result-desc">{formatDate(r.date)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {matchedNotes.length === 0 && matchedTasks.length === 0 && matchedReminders.length === 0 && (
            <div className="empty-state">No results found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}
