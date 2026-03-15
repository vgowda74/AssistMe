import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import BottomNav from './components/BottomNav';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import LabelsPage from './pages/LabelsPage';
import RemindersPage from './pages/RemindersPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <div className="app-content">
            <Routes>
              <Route path="/" element={<NotesPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/labels" element={<LabelsPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
