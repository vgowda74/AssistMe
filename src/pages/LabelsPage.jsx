import { useState } from 'react';
import { useApp } from '../store/AppContext';
import './LabelsPage.css';

const colorOptions = ['#2563eb', '#22c55e', '#ef4444', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6'];

export default function LabelsPage() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(colorOptions[0]);

  const handleCreateLabel = () => {
    if (!newName.trim()) return;
    dispatch({
      type: 'ADD_LABEL',
      payload: {
        id: newName.toLowerCase().replace(/\s+/g, '-'),
        name: newName.trim(),
        color: newColor,
        noteCount: 0,
      },
    });
    setNewName('');
    setNewColor(colorOptions[0]);
    setShowCreate(false);
  };

  const handleDelete = (labelId) => {
    dispatch({ type: 'DELETE_LABEL', payload: labelId });
  };

  return (
    <div className="labels-page">
      <header className="labels-header">
        <h1>Labels</h1>
        <button className="labels-edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </header>

      <div className="labels-list">
        {state.labels.map((label) => (
          <div key={label.id} className="label-item">
            {isEditing && (
              <button className="label-delete-btn" onClick={() => handleDelete(label.id)}>−</button>
            )}
            <span className="label-dot" style={{ background: label.color }} />
            <span className="label-name">{label.name}</span>
            <span className="label-count">{label.noteCount} notes</span>
            <span className="label-arrow">›</span>
          </div>
        ))}

        <div className="label-item create-label" onClick={() => setShowCreate(!showCreate)}>
          <span className="create-label-icon">✦</span>
          <span className="create-label-text">Create New Label</span>
        </div>

        {showCreate && (
          <div className="create-label-form">
            <input
              className="create-label-input"
              placeholder="Label name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateLabel()}
            />
            <div className="create-label-colors">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  className={`color-option ${newColor === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setNewColor(c)}
                />
              ))}
            </div>
            <button className="create-label-save" onClick={handleCreateLabel}>Create</button>
          </div>
        )}
      </div>
    </div>
  );
}
