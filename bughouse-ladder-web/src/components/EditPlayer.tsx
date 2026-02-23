import { useState, useEffect} from 'react';
import { X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PlayerData } from '../utils/hashUtils';
import './css/index.css';

interface EditPlayerProps {
  player: PlayerData;
  onClose: () => void;
}

export default function EditPlayer({ player, onClose }: EditPlayerProps) {
  const [groupLetter, setGroupLetter] = useState('');

  useEffect(() => {
    setGroupLetter(player.group.slice(0, -1) || '');
  }, [player]);

  const groupLetters = ['A1', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'Z'];

  const handleCancel = () => {
    onClose();
  };

  const handleSave = () => {
    onClose();
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
            <span style={{ fontSize: '1.5rem' }}>
              [ {player.rank} ]
            </span>
            Edit Player
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              First Name
            </label>
            <input
              type="text"
              value={player.firstName}
              className="input-cell"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Last Name
            </label>
            <input
              type="text"
              value={player.lastName}
              className="input-cell"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Group
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {groupLetters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    setGroupLetter(letter);
                  }}
                  className={`btn-secondary ${groupLetter === letter ? 'btn-primary' : ''}`}
                  style={{ 
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Rating
            </label>
            <input
              type="number"
              value={player.nRating}
              className="input-cell"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Grade
            </label>
            <input
              type="text"
              value={player.grade}
              className="input-cell"
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <button onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>

          <button onClick={handleSave} className="btn">
            <Save size={16} className="btn-icon" /> Save
          </button>

          <button onClick={handleSave} className="btn-secondary">
            <ChevronLeft size={16} className="btn-icon" /> Back
          </button>

          <button onClick={handleSave} className="btn-secondary">
            Next<ChevronRight size={16} className="btn-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}