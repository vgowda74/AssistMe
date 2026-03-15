import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const tabs = [
  { to: '/', label: 'Notes', icon: '🏠' },
  { to: '/tasks', label: 'Tasks', icon: '☑️' },
  { to: '/labels', label: 'Labels', icon: '🏷️' },
  { to: '/reminders', label: 'Reminders', icon: '🔔' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
