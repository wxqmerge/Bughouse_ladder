/**
 * VB6 Bughouse Ladder - Settings Component
 * Translated from Settings.frm - Configuration dialog
 */

import { useState, useEffect } from 'react';
import { X, Save, Settings as SettingsIcon } from 'lucide-react';
import '../css/index.css';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [showRatings, setShowRatings] = useState(true);

  useEffect(() => {
    const savedSettings = localStorage.getItem('ladder_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setShowRatings(parsedSettings.showRatings ?? true);
      } catch (err) {
        console.error('Failed to parse settings:', err);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      showRatings: [showRatings, showRatings, showRatings, showRatings]
    };
    localStorage.setItem('ladder_settings', JSON.stringify(settings));
    onClose();
    alert('Settings saved successfully!');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--surface-color)',
        padding: '2rem',
        borderRadius: '0.5rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2>
            <SettingsIcon size={24} style={{ marginRight: '0.5rem' }} />
            Settings
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={showRatings}
              onChange={(e) => setShowRatings(e.target.checked)}
            />
            <span>Show ratings</span>
          </label>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
            A1 - A8, I1 - I8, Z1 - Z8 groups based on rating
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn">
            <Save size={16} className="btn-icon" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}