import { useState, useMemo } from 'react';
import { Save, X } from 'lucide-react';
import type { PlayerData } from '../utils/hashUtils';
import './css/index.css';

export default function LadderForm() {
  const [saveFlag, setSaveFlag] = useState(0);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [kFactor, setKFactor] = useState(32);
  const [entrySize, setEntrySize] = useState(300);
  const [appZoom, setAppZoom] = useState(1);
  const [grows, setGrows] = useState(0);

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

    const settings = localStorage.getItem('ladder_settings');
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        setKFactor(parsedSettings.kFactor || 32);
      } catch (err) {
        console.error('Failed to parse settings:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (saveFlag > 0) {
      localStorage.setItem('ladder_players', JSON.stringify(players));
      localStorage.setItem('ladder_settings', JSON.stringify({
        kFactor
      }));
      setSaveFlag(0);
    }
  }, [players, saveFlag, kFactor]);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      return a.rank - b.rank;
    });
  }, [players]);

  if (!players || players.length === 0) {
    return (
      <div style={{ padding: '2rem', color: '#64748b' }}>
        <h1>Bughouse Chess Ladder - Web Version</h1>
        <p>Loading sample data...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem', width: '100%' }}>
      <header style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
        color: 'white',
        padding: '1rem 2rem',
        marginBottom: '1rem'
      }}>
        <h1>
          Bughouse Chess Ladder
          <span style={{ marginLeft: 'auto', fontSize: '0.875rem' }}>v1.0.0</span>
        </h1>
      </header>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem'
      }}>
        <button style={{
          background: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Save size={16} /> Save
        </button>

        <button style={{
          background: 'white',
          color: 'black',
          border: '1px solid #cbd5e1',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          Zoom: {Math.round(appZoom * 100)}%
        </button>

        <button style={{
          background: 'white',
          color: 'black',
          border: '1px solid #cbd5e1',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          {entrySize > 300 ? 'Narrow' : 'Wide'}
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: 'white', fontSize: '0.875rem' }}>
            Players: <strong>{grows}</strong>
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Players</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2563eb' }}>{grows}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Games Played</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2563eb' }}>
            {players.reduce((sum, p) => sum + (p.games || 0), 0)}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>K-Factor</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2563eb' }}>{kFactor}</div>
        </div>
      </div>

      <div style={{
        overflow: 'auto',
        border: '1px solid #cbd5e1',
        borderRadius: '0.5rem'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          minWidth: '1000px'
        }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              {Object.keys(players[0] || {}).map((field, index) => (
                <th key={`${field}-${index}`} style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: 'left',
                  fontWeight: '500',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: '#0f172a',
                  color: 'white'
                }}>
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
                  {field !== 'group' && field !== 'lastName' && field !== 'firstName' && field !== 'rating' && field !== 'nRating' && field !== 'rank' && field !== 'games' && field !== 'grade' && (
                    <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, row) => (
              <tr
                key={player.rank}
                style={{
                  backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent',
                  borderBottom: '1px solid #e2e8f0'
                }}
              >
                {Object.keys(player).map((field, col) => (
                  <td
                    key={`${row}-${col}`}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid #e2e8f0',
                      verticalAlign: 'middle',
                      backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent',
                      cursor: 'text'
                    }}
                  >
                    {field === 'rank' && player.rank}
                    {field === 'group' && player.group}
                    {field === 'lastName' && player.lastName}
                    {field === 'firstName' && player.firstName}
                    {field === 'rating' && ''}
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

      <div style={{
        padding: '1rem',
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        color: '#64748b'
      }}>
        <div>
          <span>Players: </span>
          <span style={{ fontWeight: 600, color: '#2563eb' }}>{grows}</span>
        </div>
      </div>
    </div>
  );
}