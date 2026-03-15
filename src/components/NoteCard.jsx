import { useApp } from '../store/AppContext';
import './NoteCard.css';

const labelColors = {
  work: '#2563eb',
  personal: '#22c55e',
  important: '#ef4444',
  todo: '#f59e0b',
  ideas: '#a855f7',
};

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NoteCard({ note, onClick }) {
  const { state, dispatch } = useApp();

  const handleToggleTask = (e, taskId) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_TASK', payload: { noteId: note.id, taskId } });
  };

  const visibleTasks = note.tasks.slice(0, 3);
  const remaining = note.tasks.length - 3;
  const borderColor = note.labels.length > 0 ? (labelColors[note.labels[0]] || '#e5e7eb') : '#e5e7eb';

  return (
    <div className="note-card" style={{ borderLeftColor: borderColor }} onClick={() => onClick?.(note)}>
      <h3 className="note-card-title">{note.title}</h3>

      {note.type === 'checklist' && visibleTasks.length > 0 ? (
        <div className="note-card-tasks">
          {visibleTasks.map((task) => (
            <div key={task.id} className="note-card-task" onClick={(e) => handleToggleTask(e, task.id)}>
              <span className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                {task.completed && '✓'}
              </span>
              <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.text}</span>
            </div>
          ))}
          {remaining > 0 && <div className="note-card-more">+{remaining} more</div>}
        </div>
      ) : note.content ? (
        <p className="note-card-content">{note.content}</p>
      ) : null}

      <div className="note-card-footer">
        <div className="note-card-labels">
          {note.labels.map((lid) => {
            const label = state.labels.find((l) => l.id === lid);
            return label ? (
              <span key={lid} className="note-label-tag" style={{ color: labelColors[lid], borderColor: labelColors[lid] }}>
                {label.name}
              </span>
            ) : null;
          })}
        </div>
        {note.reminder && <span className="note-card-time">⏰ {formatTime(note.createdAt)}</span>}
        {!note.reminder && <span className="note-card-time">{formatTime(note.createdAt)}</span>}
      </div>
    </div>
  );
}
