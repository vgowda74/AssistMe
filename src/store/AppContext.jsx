import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialLabels = [
  { id: 'work', name: 'Work', color: '#2563eb', noteCount: 0 },
  { id: 'personal', name: 'Personal', color: '#22c55e', noteCount: 0 },
  { id: 'important', name: 'Important', color: '#ef4444', noteCount: 0 },
  { id: 'todo', name: 'To-Do', color: '#f59e0b', noteCount: 0 },
  { id: 'ideas', name: 'Ideas', color: '#a855f7', noteCount: 0 },
];

const initialNotes = [
  {
    id: '1',
    title: 'Meeting Notes',
    content: 'Discussed Q2 roadmap and feature priorities. Follow up with design team on mockups.',
    labels: ['work', 'important'],
    type: 'text',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [
      { id: 't1', text: 'Follow up with design team', completed: false, dueDate: new Date().toISOString() },
    ],
    reminder: null,
  },
  {
    id: '2',
    title: 'Weekend Errands',
    content: '',
    labels: ['personal'],
    type: 'checklist',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    tasks: [
      { id: 't2', text: 'Buy groceries', completed: true, dueDate: null },
      { id: 't3', text: 'Pick up dry cleaning', completed: false, dueDate: null },
      { id: 't4', text: 'Call dentist', completed: false, dueDate: new Date(Date.now() + 86400000).toISOString() },
      { id: 't5', text: 'Return library books', completed: false, dueDate: null },
    ],
    reminder: null,
  },
  {
    id: '3',
    title: 'Book Recommendations',
    content: '• Atomic Habits\n• Deep Work\n• The Lean Startup',
    labels: ['todo'],
    type: 'text',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    tasks: [],
    reminder: null,
  },
  {
    id: '4',
    title: "Doctor's Appointment",
    content: "Don't forget to bring insurance card and report.",
    labels: ['personal'],
    type: 'text',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    tasks: [],
    reminder: {
      id: 'r1',
      date: new Date(Date.now() + 86400000).toISOString(),
      completed: false,
    },
  },
  {
    id: '5',
    title: 'Finance Notes',
    content: 'Review quarterly expenses and budget allocation.',
    labels: ['work', 'important'],
    type: 'text',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
    tasks: [
      { id: 't6', text: 'Pay Property Tax', completed: false, dueDate: '2026-03-15T18:30:00.000Z' },
    ],
    reminder: {
      id: 'r2',
      date: '2026-03-15T18:30:00.000Z',
      completed: false,
    },
  },
  {
    id: '6',
    title: 'Hiking Trip Planning',
    content: 'Plan route, check weather, pack essentials.',
    labels: ['personal', 'todo'],
    type: 'text',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
    tasks: [
      { id: 't7', text: 'Buy hiking gear', completed: false, dueDate: '2026-04-12T00:00:00.000Z' },
    ],
    reminder: {
      id: 'r3',
      date: '2026-04-12T07:00:00.000Z',
      completed: false,
    },
  },
];

const initialSettings = {
  notificationSound: 'Chime',
  snoozeMinutes: 10,
  voiceQuality: 'High Quality',
  autoSaveVoice: true,
  appLock: true,
  passcode: '1234',
};

function getInitialState() {
  try {
    const saved = localStorage.getItem('assistme-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return {
    notes: initialNotes,
    labels: initialLabels,
    settings: initialSettings,
  };
}

function recalcLabelCounts(notes, labels) {
  return labels.map((l) => ({
    ...l,
    noteCount: notes.filter((n) => n.labels.includes(l.id)).length,
  }));
}

function appReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD_NOTE':
      newState = { ...state, notes: [action.payload, ...state.notes] };
      break;
    case 'UPDATE_NOTE':
      newState = {
        ...state,
        notes: state.notes.map((n) => (n.id === action.payload.id ? { ...n, ...action.payload } : n)),
      };
      break;
    case 'DELETE_NOTE':
      newState = { ...state, notes: state.notes.filter((n) => n.id !== action.payload) };
      break;
    case 'TOGGLE_TASK': {
      const { noteId, taskId } = action.payload;
      newState = {
        ...state,
        notes: state.notes.map((n) =>
          n.id === noteId
            ? {
                ...n,
                tasks: n.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
              }
            : n
        ),
      };
      break;
    }
    case 'ADD_LABEL':
      newState = { ...state, labels: [...state.labels, action.payload] };
      break;
    case 'UPDATE_LABEL':
      newState = {
        ...state,
        labels: state.labels.map((l) => (l.id === action.payload.id ? { ...l, ...action.payload } : l)),
      };
      break;
    case 'DELETE_LABEL':
      newState = {
        ...state,
        labels: state.labels.filter((l) => l.id !== action.payload),
        notes: state.notes.map((n) => ({ ...n, labels: n.labels.filter((lid) => lid !== action.payload) })),
      };
      break;
    case 'COMPLETE_REMINDER': {
      const noteId = action.payload;
      newState = {
        ...state,
        notes: state.notes.map((n) =>
          n.id === noteId && n.reminder ? { ...n, reminder: { ...n.reminder, completed: true } } : n
        ),
      };
      break;
    }
    case 'UPDATE_SETTINGS':
      newState = { ...state, settings: { ...state.settings, ...action.payload } };
      break;
    default:
      return state;
  }
  newState.labels = recalcLabelCounts(newState.notes, newState.labels);
  return newState;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);

  useEffect(() => {
    const stateWithCounts = {
      ...state,
      labels: recalcLabelCounts(state.notes, state.labels),
    };
    localStorage.setItem('assistme-state', JSON.stringify(stateWithCounts));
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
