import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import NoteCard from '../components/NoteCard';
import VoiceModal from '../components/VoiceModal';
import NoteEditor from '../components/NoteEditor';
import './NotesPage.css';

export default function NotesPage() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showVoice, setShowVoice] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const filters = [
    { id: 'all', label: 'All' },
    ...state.labels.map((l) => ({ id: l.id, label: l.name })),
  ];

  const filteredNotes =
    activeFilter === 'all'
      ? state.notes
      : state.notes.filter((n) => n.labels.includes(activeFilter));

  const handleNoteClick = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  return (
    <div className="notes-page">
      <header className="notes-header">
        <div className="notes-header-row">
          <button className="hamburger-btn">☰</button>
          <h1 className="app-title">AssistMe</h1>
          <button className="voice-btn-header" onClick={() => setShowVoice(true)}>🎙️</button>
        </div>

        <div className="search-bar" onClick={() => navigate('/search')}>
          <span className="search-icon">🔍</span>
          <span className="search-placeholder">Search your notes...</span>
          <span className="search-mic" onClick={(e) => { e.stopPropagation(); setShowVoice(true); }}>🖊️</span>
        </div>

        <div className="filter-chips">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`filter-chip ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="notes-list">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onClick={handleNoteClick} />
        ))}
        {filteredNotes.length === 0 && (
          <div className="empty-state">No notes yet. Tap + to create one!</div>
        )}
      </div>

      <button className="fab" onClick={handleNewNote}>+</button>

      {showVoice && <VoiceModal onClose={() => setShowVoice(false)} />}
      {showEditor && (
        <NoteEditor note={editingNote} onClose={() => { setShowEditor(false); setEditingNote(null); }} />
      )}
    </div>
  );
}
