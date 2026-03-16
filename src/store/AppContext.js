import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialRecipes from '../data/recipes';

const AppContext = createContext();

const STORAGE_KEY = 'assistme-state';

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

const defaultState = {
  notes: initialNotes,
  labels: initialLabels,
  recipes: initialRecipes,
  settings: initialSettings,
  loaded: false,
};

function recalcLabelCounts(notes, labels) {
  return labels.map((l) => ({
    ...l,
    noteCount: notes.filter((n) => n.labels.includes(l.id)).length,
  }));
}

function appReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'LOAD_STATE':
      newState = { ...action.payload, loaded: true };
      break;
    case 'SET_LOADED':
      return { ...state, loaded: true };
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
            ? { ...n, tasks: n.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)) }
            : n
        ),
      };
      break;
    }
    case 'ADD_LABEL':
      newState = { ...state, labels: [...state.labels, action.payload] };
      break;
    case 'DELETE_LABEL':
      newState = {
        ...state,
        labels: state.labels.filter((l) => l.id !== action.payload),
        notes: state.notes.map((n) => ({ ...n, labels: n.labels.filter((lid) => lid !== action.payload) })),
      };
      break;
    case 'COMPLETE_REMINDER': {
      newState = {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload && n.reminder ? { ...n, reminder: { ...n.reminder, completed: true } } : n
        ),
      };
      break;
    }
    case 'ADD_RECIPE':
      newState = { ...state, recipes: [action.payload, ...(state.recipes || [])] };
      break;
    case 'DELETE_RECIPE':
      newState = { ...state, recipes: (state.recipes || []).filter((r) => r.id !== action.payload) };
      break;
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
  const [state, dispatch] = useReducer(appReducer, defaultState);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.labels = recalcLabelCounts(parsed.notes, parsed.labels);
          if (!parsed.recipes) parsed.recipes = initialRecipes;
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        } else {
          dispatch({ type: 'SET_LOADED' });
        }
      } catch {
        dispatch({ type: 'SET_LOADED' });
      }
    })();
  }, []);

  useEffect(() => {
    if (state.loaded) {
      const { loaded, ...toSave } = state;
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
