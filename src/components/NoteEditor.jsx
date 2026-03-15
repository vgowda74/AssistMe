import { useState } from 'react';
import { useApp } from '../store/AppContext';
import './NoteEditor.css';

export default function NoteEditor({ note, onClose }) {
  const { state, dispatch } = useApp();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedLabels, setSelectedLabels] = useState(note?.labels || []);
  const [noteType, setNoteType] = useState(note?.type || 'text');
  const [tasks, setTasks] = useState(note?.tasks || []);
  const [newTask, setNewTask] = useState('');

  const toggleLabel = (labelId) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId) ? prev.filter((l) => l !== labelId) : [...prev, labelId]
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: `t-${Date.now()}`, text: newTask.trim(), completed: false, dueDate: null }]);
    setNewTask('');
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim() && tasks.length === 0) return;
    const now = new Date().toISOString();

    if (note) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: {
          id: note.id,
          title: title.trim() || 'Untitled',
          content,
          labels: selectedLabels,
          type: noteType,
          tasks,
          updatedAt: now,
        },
      });
    } else {
      dispatch({
        type: 'ADD_NOTE',
        payload: {
          id: Date.now().toString(),
          title: title.trim() || 'Untitled',
          content,
          labels: selectedLabels,
          type: noteType,
          createdAt: now,
          updatedAt: now,
          tasks,
          reminder: null,
        },
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (note) {
      dispatch({ type: 'DELETE_NOTE', payload: note.id });
    }
    onClose();
  };

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <button className="editor-back" onClick={onClose}>← Back</button>
          <div className="editor-header-actions">
            {note && <button className="editor-delete" onClick={handleDelete}>🗑️</button>}
            <button className="editor-save" onClick={handleSave}>Save</button>
          </div>
        </div>

        <input
          className="editor-title"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editor-type-toggle">
          <button className={noteType === 'text' ? 'active' : ''} onClick={() => setNoteType('text')}>Text</button>
          <button className={noteType === 'checklist' ? 'active' : ''} onClick={() => setNoteType('checklist')}>Checklist</button>
        </div>

        {noteType === 'text' ? (
          <textarea
            className="editor-content"
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="editor-tasks">
            {tasks.map((task) => (
              <div key={task.id} className="editor-task-item">
                <span className="editor-task-text">{task.text}</span>
                <button className="editor-task-remove" onClick={() => removeTask(task.id)}>✕</button>
              </div>
            ))}
            <div className="editor-task-add">
              <input
                placeholder="Add a task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <button onClick={addTask}>+</button>
            </div>
          </div>
        )}

        <div className="editor-labels">
          <span className="editor-labels-title">Labels:</span>
          <div className="editor-label-chips">
            {state.labels.map((label) => (
              <button
                key={label.id}
                className={`editor-label-chip ${selectedLabels.includes(label.id) ? 'selected' : ''}`}
                style={{
                  borderColor: label.color,
                  background: selectedLabels.includes(label.id) ? label.color : 'transparent',
                  color: selectedLabels.includes(label.id) ? '#fff' : label.color,
                }}
                onClick={() => toggleLabel(label.id)}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
