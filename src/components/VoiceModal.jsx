import { useEffect } from 'react';
import { useVoice } from '../hooks/useVoice';
import { useApp } from '../store/AppContext';
import './VoiceModal.css';

export default function VoiceModal({ onClose }) {
  const { isListening, transcript, error, startListening, stopListening, resetTranscript } = useVoice();
  const { dispatch } = useApp();

  useEffect(() => {
    startListening();
    return () => stopListening();
  }, [startListening, stopListening]);

  const handleSave = () => {
    if (!transcript.trim()) return;
    const isReminder = /remind/i.test(transcript);
    const now = new Date().toISOString();
    const noteId = Date.now().toString();

    dispatch({
      type: 'ADD_NOTE',
      payload: {
        id: noteId,
        title: transcript.slice(0, 50) + (transcript.length > 50 ? '...' : ''),
        content: transcript,
        labels: [],
        type: 'text',
        createdAt: now,
        updatedAt: now,
        tasks: [],
        reminder: isReminder
          ? { id: `r-${noteId}`, date: new Date(Date.now() + 86400000).toISOString(), completed: false }
          : null,
      },
    });
    stopListening();
    resetTranscript();
    onClose();
  };

  const handleAddReminder = () => {
    if (!transcript.trim()) return;
    const now = new Date().toISOString();
    const noteId = Date.now().toString();

    dispatch({
      type: 'ADD_NOTE',
      payload: {
        id: noteId,
        title: transcript.slice(0, 50) + (transcript.length > 50 ? '...' : ''),
        content: transcript,
        labels: [],
        type: 'text',
        createdAt: now,
        updatedAt: now,
        tasks: [],
        reminder: { id: `r-${noteId}`, date: new Date(Date.now() + 86400000).toISOString(), completed: false },
      },
    });
    stopListening();
    resetTranscript();
    onClose();
  };

  return (
    <div className="voice-modal-overlay" onClick={onClose}>
      <div className="voice-modal" onClick={(e) => e.stopPropagation()}>
        <button className="voice-modal-close" onClick={onClose}>✕</button>

        <div className="voice-modal-status">
          {isListening ? 'Listening...' : error ? `Error: ${error}` : 'Tap to start'}
        </div>

        <div className="voice-waveform">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={`waveform-bar ${isListening ? 'active' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>

        {transcript && (
          <div className="voice-transcript">"{transcript}"</div>
        )}

        {!isListening && !transcript && (
          <button className="voice-start-btn" onClick={startListening}>
            Start Recording
          </button>
        )}

        {(transcript || isListening) && (
          <div className="voice-actions">
            <button className="voice-btn voice-btn-save" onClick={handleSave}>
              Save
            </button>
            <button className="voice-btn voice-btn-reminder" onClick={handleAddReminder}>
              Add Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
