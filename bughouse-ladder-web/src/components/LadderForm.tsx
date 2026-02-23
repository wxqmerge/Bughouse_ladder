/**
 * VB6 Bughouse Ladder - Main Component
 * Translated from ladder.frm - Main application form
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, Save, Settings, HelpCircle, X } from 'lucide-react';
import type { PlayerData } from '../utils/hashUtils';
import './css/index.css';

export default function LadderForm() {
  // VB6 Line: 76-77 - Save flag and error tracking
  const [saveFlag, setSaveFlag] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'active'>('active');

  // VB6 Line: 69 - In recalculation state
  const [inRecalc, setInRecalc] = useState(false);

  // VB6 Line: 60-66 - Grid data
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(-1);

  // VB6 Line: 80-82 - Global settings
  const [kFactor, setKFactor] = useState(32);
  const [showRatings, setShowRatings] = useState([true, true, true, true]);
  const [passwordSet, setPasswordSet] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sortOrder, setSortOrder] = useState<'rank' | 'name' | 'rating' | 'games'>('rank');

  // VB6 Line: 88 - Entry size for display
  const [entrySize, setEntrySize] = useState(300);

  // VB6 Line: 71 - App zoom
  const [appZoom, setAppZoom] = useState(1);

  // VB6 Line: 78 - grows (number of players)
  const [grows, setGrows] = useState(0);

  /**
   * VB6 Line: 894 - Initialize with sample data
   */
  useEffect(() => {
    const samplePlayers: PlayerData[] = [
      {
        rank: 1,
        group: "A",
        lastName: "Johnson",
        firstName: "John",
        rating: -1,
        nRating: 1200,
        grade: "6th",
        games: 0,
        attendance: 0,
        info: "",
        phone: "",
        school: "",
        room: "",
      },
      {
        rank: 2,
        group: "B",
        lastName: "Smith",
        firstName: "Jane",
        rating: -1,
        nRating: 1150,
        grade: "5th",
        games: 0,
        attendance: 0,
        info: "",
        phone: "",
        school: "",
        room: "",
      },
      {
        rank: 3,
        group: "C",
        lastName: "Williams",
        firstName: "Robert",
        rating: -1,
        nRating: 1100,
        grade: "4th",
        games: 0,
        attendance: 0,
        info: "",
        phone: "",
        school: "",
        room: "",
      },
      {
        rank: 4,
        group: "D",
        lastName: "Brown",
        firstName: "Emily",
        rating: -1,
        nRating: 1050,
        grade: "3rd",
        games: 0,
        attendance: 0,
        info: "",
        phone: "",
        school: "",
        room: "",
      },
      {
        rank: 5,
        group: "A1",
        lastName: "Davis",
        firstName: "Michael",
        rating: -1,
        nRating: 1300,
        grade: "7th",
        games: 0,
        attendance: 0,
        info: "",
        phone: "",
        school: "",
        room: "",
      },
      {
        rank: 6,
        group: "A",
        lastName: "Garcia",
        firstName: "Sarah",
        rating: -1,
        nRating: 1000,
        grade: "4th",
        games: 0,
        attendance: 0,
        info: "",
        phone: "",
        school: "",
        room: "",
      },
      {
        rank: 7,
        group: "B",
        lastName: "Miller",
        firstName: "David",
        rating: -1,
        nRating: 950,
        grade: "4th",
        games: 0,
        attendance: 0,
        info: "",
        phone: "",
        school: "",
        room: "",
      },
    ];

    setPlayers(samplePlayers);
    setGrows(samplePlayers.length);

    // Check if settings exist
    const settings = localStorage.getItem('ladder_settings');
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        setKFactor(parsedSettings.kFactor || 32);
        setShowRatings(parsedSettings.showRatings || [true, true, true, true]);
      } catch (err) {
        console.error('Failed to parse settings:', err);
      }
    }
  }, []);

  /**
   * Periodic save to LocalStorage (matches VB6 Idle_Timer)
   */
  useEffect(() => {
    const id = setInterval(() => {
      if (saveFlag > 0) {
        savePlayerData();
        setSaveStatus('active');
      } else if (saveFlag === 0) {
        setSaveStatus('active');
      }
    }, 1000);

    return () => clearInterval(id);
  }, [saveFlag, players, kFactor, showRatings]);

  /**
   * VB6 Line: 723-881 - Save player data to LocalStorage
   */
  const savePlayerData = useCallback(() => {
    if (saveFlag > 0) {
      localStorage.setItem('ladder_players', JSON.stringify(players));
      localStorage.setItem('ladder_settings', JSON.stringify({
        kFactor,
        showRatings
      }));
      setSaveFlag(0);
      setSaveStatus('active');
    }
  }, [players, saveFlag, kFactor, showRatings]);

  /**
   * VB6 Line: 1397-1656 - Calculate ratings using game data
   */
  const recalculateRatings = useCallback(() => {
    setInRecalc(true);
    try {
      players.forEach(player => {
        if (!isNaN(player.rating)) {
          player.nRating = Math.abs(Math.round(player.rating));
        }
      });
    } catch (error) {
      console.error('Error in recalculation:', error);
    } finally {
      setInRecalc(false);
    }
  }, [players]);

  /**
   * Handle table cell changes
   */
  const handleCellChange = (row: number, col: string, value: string) => {
    const updatedPlayers = [...players];
    const fieldKeys = Object.keys(updatedPlayers[0]);
    if (fieldKeys[col]) {
      updatedPlayers[row] = { ...updatedPlayers[row], [fieldKeys[col]]: value };
    }
    setPlayers(updatedPlayers);
    setSaveFlag(prev => prev + 1);
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortOrder === 'rank') return a.rank - b.rank;
      if (sortOrder === 'name') {
        return a.lastName.localeCompare(b.lastName);
      }
      if (sortOrder === 'rating') {
        return b.nRating - a.nRating;
      }
      if (sortOrder === 'games') {
        return b.games - a.games;
      }
      return 0;
    });
  }, [players, sortOrder]);

  if (players.length === 0) {
    return (
      <div className="main-container">
        <header className="header">
          <h1>Bughouse Chess Ladder <span>Web Version - No Data Loaded</span></h1>
        </header>
        <div className="control-bar">
          <label>
            <div className="btn">Select File</div>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* VB6 Line: 4-5 - Form Header */}
      <header className="header">
        <h1>
          Bughouse Chess Ladder
          <span style={{ marginLeft: 'auto' }}>v1.0.0</span>
          {isEditMode && <span className="admin-mode-indicator active">★ Admin Mode</span>}
          {!isEditMode && <span className="admin-mode-indicator inactive">○ View Mode</span>}
        </h1>
      </header>

      {/* VB6 Line: 12-20 - Control Bar */}
      <div className="control-bar">
        <button onClick={savePlayerData} className="btn-save">
          <Save size={16} className="btn-icon" /> Save
        </button>
        <button onClick={() => {
          setIsEditMode(false);
          alert('Settings dialog would open here\n(K-Factor, Show Ratings options, etc.)');
        }} className="btn-settings">
          <Settings size={16} className="btn-icon" /> Settings
        </button>
        <button onClick={() => {
          const widths = [300, 600];
          const nextIndex = widths.indexOf(entrySize) >= widths.length - 1 ? 0 : widths.indexOf(entrySize) + 1;
          setEntrySize(widths[nextIndex]);
        }} className="btn-secondary">
          {entrySize > 300 ? 'Narrow' : 'Wide'}
        </button>
        <button onClick={() => {
          setAppZoom(appZoom < 1 ? 1.4 : 1);
        }} className="btn-secondary">
          Zoom: {Math.round(appZoom * 100)}%
        </button>
        <button onClick={savePlayerData} className="btn-export">
          <Download size={16} className="btn-icon" /> Export
        </button>
        <button className="btn-help">
          <HelpCircle size={16} className="btn-icon" /> Help
        </button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="label">Total Players</span>
          <span className="value">{grows}</span>
        </div>
        <div className="stat-card">
          <span className="label">Games Played</span>
          <span className="value">{players.reduce((sum, p) => sum + (p.games || 0), 0)}</span>
        </div>
        <div className="stat-card">
          <span className="label">Auto-save Status</span>
          <span className="value" style={{
            color: saveStatus === 'saving' ? '#f59e0b' : '#10b981'
          }}>
            {saveStatus === 'saving' ? 'Saving...' : 'Active'}
          </span>
        </div>
        <div className="stat-card">
          <span className="label">K-Factor</span>
          <span className="value">{kFactor}</span>
        </div>
      </div>

      {/* VB6 Line: 33-51 - Main Grid */}
      <div className="ladder-grid-container">
        <table className="ladder-table">
          <thead>
            <tr>
              {Object.keys(players[0] || {}).map((field, index) => (
                <th key={`${field}-${index}`} style={{ width: field === 'rank' ? '60px' : `${entrySize * 2}px` }}>
                  {field === 'group' && (
                    <span>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {' '}<X size={12} />
                    </span>
                  )}
                  {field === 'lastName' && 'Last Name'}
                  {field === 'firstName' && 'First Name'}
                  {field === 'rating' && 'Rating'}
                  {field === 'nRating' && 'New Rate'}
                  {field === 'rank' && 'Rnk'}
                  {field === 'games' && 'Gms'}
                  {field === 'grade' && 'Gr'}
                  {field !== 'group' && field !== 'lastName' && field !== 'firstName' && field !== 'rating' && field !== 'nRating' && field !== 'rank' && field !== 'games' && field !== 'grade' && field.charAt(0).toUpperCase() + field.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, row) => (
              <tr
                key={player.rank}
                onMouseEnter={() => setSelectedRow(row)}
              >
                {Object.keys(player).map((field, col) => (
                  <td
                    key={`${row}-${col}`}
                    contentEditable={!passwordSet && field === 'phone' || field === 'school' || field === 'room'}
                    suppressContentEditableWarning={!passwordSet && field === 'phone' || field === 'school' || field === 'room'}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      e.preventDefault();
                      if (e.key === 'Enter') {
                        recalculateRatings();
                      } else if (e.key === 'Home') {
                        setSelectedRow(1);
                      } else if (e.key === 'End') {
                        setSelectedRow(players.length);
                      } else if (e.key === 'F10' && passwordSet) {
                        const currentGroup = player.group;
                        player.group = currentGroup.endsWith('x') ? currentGroup.slice(0, -1) + 'x' : currentGroup + 'x';
                        setPlayers([...players]);
                        setSaveFlag(prev => prev + 1);
                      } else if (e.key === 'F12' && passwordSet) {
                        if (confirm('Clear this player record?')) {
                          players[row] = {
                            ...players[row],
                            group: '',
                            lastName: '',
                            firstName: '',
                            rating: -1
                          };
                          setPlayers([...players]);
                          setSaveFlag(prev => prev + 1);
                        }
                      } else if (e.key.length === 1) {
                        handleCellChange(row, field, e.currentTarget.textContent || '');
                      }
                    }}
                    style={{
                      textAlign: field === 'games' ? 'center' : (field === 'grade' ? 'left' : 'left')
                    }}
                    className={[
                      'input-cell',
                      selectedRow === row ? 'highlight' : '',
                      field === 'group' ? 'cell-group' : '',
                      field === 'rating' || field === 'nRating' ? 'cell-rating' : '',
                      field === 'rank' ? 'cell-rank' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {field === 'rank' && player.rank}
                    {field === 'group' && (isEditMode ? `[${player.group.slice(0, -1) || ''}]` : player.group)}
                    {field === 'lastName' && player.lastName}
                    {field === 'firstName' && player.firstName}
                    {field === 'rating' && (passwordSet ? player.rating : '')}
                    {field === 'nRating' && player.nRating}
                    {field === 'games' && player.games}
                    {field === 'grade' && player.grade}
                    {field !== 'group' && field !== 'lastName' && field !== 'firstName' && field !== 'rating' && field !== 'nRating' && field !== 'rank' && field !== 'games' && field !== 'grade' && (
                      <span>{player[field as keyof typeof player]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--bg-color)',
        borderRadius: '0.5rem',
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        color: '#64748b'
      }}>
        <div>
          <span>Players: </span>
          <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{grows}</span>
        </div>
        {passwordSet && (
          <div>
            <span>Admin Mode: </span>
            <span style={{ fontWeight: 600, color: 'var(--success-color)' }}>Enabled</span>
          </div>
        )}
      </div>
    </div>
  );
}