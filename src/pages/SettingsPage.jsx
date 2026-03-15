import { useState } from 'react';
import { useApp } from '../store/AppContext';
import './SettingsPage.css';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const { settings } = state;

  const updateSetting = (key, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
      </header>

      <div className="settings-profile">
        <div className="settings-avatar">A</div>
        <div className="settings-profile-info">
          <div className="settings-profile-name">AssistMe User</div>
          <div className="settings-profile-plan">Free Plan • Upgrade to Pro</div>
        </div>
        <span className="settings-arrow">›</span>
      </div>

      <div className="settings-section">
        <div className="settings-section-label">GENERAL</div>
        <div className="settings-group">
          <div className="settings-item">
            <span className="settings-item-icon">🔔</span>
            <span className="settings-item-label">Notification Sounds</span>
            <span className="settings-item-value">{settings.notificationSound}</span>
            <span className="settings-arrow">›</span>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon">💤</span>
            <span className="settings-item-label">Snooze Options</span>
            <span className="settings-item-value">{settings.snoozeMinutes} min</span>
            <span className="settings-arrow">›</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-label">VOICE</div>
        <div className="settings-group">
          <div className="settings-item">
            <span className="settings-item-icon">🎙️</span>
            <span className="settings-item-label">Voice Recording</span>
            <span className="settings-item-value">{settings.voiceQuality}</span>
            <span className="settings-arrow">›</span>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon">💾</span>
            <span className="settings-item-label">Auto-Save Voice Notes</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.autoSaveVoice}
                onChange={(e) => updateSetting('autoSaveVoice', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-label">SECURITY</div>
        <div className="settings-group">
          <div className="settings-item">
            <span className="settings-item-icon">🔒</span>
            <span className="settings-item-label">App Lock</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.appLock}
                onChange={(e) => updateSetting('appLock', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon">🔑</span>
            <span className="settings-item-label">Change Passcode</span>
            <span className="settings-arrow">›</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-label">DATA</div>
        <div className="settings-group">
          <div className="settings-item">
            <span className="settings-item-icon">📤</span>
            <span className="settings-item-label">Export Notes</span>
            <span className="settings-arrow">›</span>
          </div>
          <div
            className="settings-item danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data?')) {
                localStorage.removeItem('assistme-state');
                window.location.reload();
              }
            }}
          >
            <span className="settings-item-icon">🗑️</span>
            <span className="settings-item-label">Clear All Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
