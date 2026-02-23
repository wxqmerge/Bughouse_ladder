/**
 * VB6 Bughouse Ladder - Settings Component
 * Translated from Settings.frm - Configuration dialog
 */

import { useState, useEffect } from 'react';
import { X, Save, Settings as SettingsIcon } from 'lucide-react';
import type { PlayerData } from '../utils/hashUtils';
import '../../css/index.css';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [kFactor, setKFactor] = useState(32);

  useEffect(() => {
    const savedSettings = localStorage.getItem('ladder_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setKFactor(parsedSettings.kFactor || 32);
      } catch (err) {
        console.error('Failed to parse settings:', err);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      kFactor,
      showRatings: [true, true, true, true]
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
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            K-Factor
          </label>
          <input
            type="number"
            value={kFactor}
            onChange={(e) => setKFactor(parseInt(e.target.value) || 32)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--border-color)'
            }}
          />
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
            A1 - I, Z groups based on rating
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={kFactor > 0}
              onChange={(e) => setKFactor(parseInt(e.target.value) || 32)}
            />
            Show ratings
          </label>
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