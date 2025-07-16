import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X, Bell, Volume2, Palette, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  const themes = [
    { id: 'tomato', name: 'Tomato Red', primary: '#e53e3e', secondary: '#fef2f2' },
    { id: 'mint', name: 'Mint Green', primary: '#10b981', secondary: '#f0fdf4' },
    { id: 'midnight', name: 'Midnight Blue', primary: '#1e40af', secondary: '#eff6ff' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="settings-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="settings-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="settings-header">
            <div className="header-content">
              <SettingsIcon size={24} />
              <h2>Settings</h2>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="settings-content">
            <div className="settings-section">
              <div className="section-header">
                <Clock size={20} />
                <h3>Timer Settings</h3>
              </div>
              
              <div className="setting-item">
                <label>Work Duration</label>
                <div className="duration-input">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localSettings.workDuration}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      workDuration: parseInt(e.target.value) || 25
                    })}
                  />
                  <span>minutes</span>
                </div>
              </div>

              <div className="setting-item">
                <label>Break Duration</label>
                <div className="duration-input">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={localSettings.breakDuration}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      breakDuration: parseInt(e.target.value) || 5
                    })}
                  />
                  <span>minutes</span>
                </div>
              </div>

              <div className="setting-item">
                <label>Long Break Duration</label>
                <div className="duration-input">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localSettings.longBreakDuration}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      longBreakDuration: parseInt(e.target.value) || 15
                    })}
                  />
                  <span>minutes</span>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <div className="section-header">
                <Bell size={20} />
                <h3>Notifications</h3>
              </div>
              
              <div className="setting-item">
                <div className="toggle-setting">
                  <label>Auto-start breaks</label>
                  <button
                    className={`toggle ${localSettings.autoStartBreak ? 'active' : ''}`}
                    onClick={() => setLocalSettings({
                      ...localSettings,
                      autoStartBreak: !localSettings.autoStartBreak
                    })}
                  >
                    <div className="toggle-thumb" />
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <div className="toggle-setting">
                  <label>Enable sounds</label>
                  <button
                    className={`toggle ${localSettings.soundEnabled ? 'active' : ''}`}
                    onClick={() => setLocalSettings({
                      ...localSettings,
                      soundEnabled: !localSettings.soundEnabled
                    })}
                  >
                    <div className="toggle-thumb" />
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <div className="toggle-setting">
                  <label>Browser notifications</label>
                  <button
                    className={`toggle ${localSettings.notificationsEnabled ? 'active' : ''}`}
                    onClick={() => setLocalSettings({
                      ...localSettings,
                      notificationsEnabled: !localSettings.notificationsEnabled
                    })}
                  >
                    <div className="toggle-thumb" />
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <div className="section-header">
                <Palette size={20} />
                <h3>Theme</h3>
              </div>
              
              <div className="theme-selector">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    className={`theme-option ${localSettings.theme === theme.id ? 'selected' : ''}`}
                    onClick={() => setLocalSettings({
                      ...localSettings,
                      theme: theme.id as any
                    })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="theme-preview"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                      }}
                    />
                    <span>{theme.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="settings-footer">
            <button className="reset-button" onClick={handleReset}>
              Reset to Default
            </button>
            <div className="action-buttons">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}