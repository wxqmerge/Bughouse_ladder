import { useState, useEffect } from 'react';
import type { PlayerData } from '../utils/hashUtils';
import '../css/index.css';

export default function LadderForm() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isWide, setIsWide] = useState(false);

  // VB6 Line: 894 - Initialize with sample data
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

    const settings = localStorage.getItem('ladder_settings');
    console.log('Settings loaded:', settings);

    // Try to load from LocalStorage first
    const savedPlayers = localStorage.getItem('ladder_players');
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Loading players from LocalStorage:', parsed);
          setPlayers(parsed);
          return;
        }
      } catch (err) {
        console.error('Failed to parse players:', err);
      }
    }

    // Use sample data as fallback
    setPlayers(samplePlayers);
  }, []);

  // VB6 Line: 723-745 - Load players function
  const loadPlayers = () => {
    const savedPlayers = localStorage.getItem('ladder_players');
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        if (Array.isArray(parsed)) {
          setPlayers(parsed);
          alert('Players loaded successfully!');
        }
      } catch (err) {
        alert('Failed to load players.');
      }
    } else {
      alert('No saved data found.');
    }
  };

  // Save players to LocalStorage
  const savePlayers = () => {
    localStorage.setItem('ladder_players', JSON.stringify(players));
    localStorage.setItem('ladder_settings', JSON.stringify({
      kFactor: 32,
      showRatings: [true, true, true, true]
    }));
    alert('Players saved successfully!');
  };

  // Toggle wide/narrow layout
  const toggleWide = () => {
    setIsWide(!isWide);
  };

  if (!players || players.length === 0) {
    return (
      <div style={{ padding: '2rem', color: '#64748b' }}>
        <h1>Bughouse Chess Ladder - Web Version</h1>
        <p>Loading sample data...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <header style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
        color: 'white',
        padding: '1rem 2rem',
        marginBottom: '1rem'
      }}>
        <h1>Bughouse Chess Ladder <span style={{ marginLeft: 'auto', fontSize: '0.875rem' }}>v1.0.0</span></h1>
      </header>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem'
      }}>
        <button
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          onClick={loadPlayers}
        >
          Load
        </button>

        <button
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          onClick={savePlayers}
        >
          Save
        </button>

        <button
          style={{
            background: 'white',
            color: 'black',
            border: '1px solid #cbd5e1',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          onClick={() => alert('Zoom level saved')}
        >
          Zoom: {isWide ? '140%' : '100%'}
        </button>

        <button
          style={{
            background: 'white',
            color: 'black',
            border: '1px solid #cbd5e1',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          onClick={toggleWide}
        >
          {isWide ? 'Narrow' : 'Wide'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Players</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2563eb' }}>{players.length}</div>
        </div>
      </div>

      <div style={{ overflow: 'auto', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem'
        }}>
          <thead>
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
                  {field === 'group' && 'Group'}
                  {field === 'lastName' && 'Last Name'}
                  {field === 'firstName' && 'First Name'}
                  {field === 'rating' && 'Rating'}
                  {field === 'nRating' && 'New Rate'}
                  {field === 'rank' && 'Rnk'}
                  {field === 'games' && 'Gms'}
                  {field !== 'group' && field !== 'lastName' && field !== 'firstName' && field !== 'rating' && field !== 'nRating' && field !== 'rank' && field !== 'games' && (field.charAt(0).toUpperCase() + field.slice(1))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, row) => (
              <tr key={player.rank} style={{
                backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent'
              }}>
                {Object.keys(player).map((field, col) => (
                  <td key={`${row}-${col}`} style={{
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid #e2e8f0',
                    verticalAlign: 'middle',
                    backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent'
                  }}>
                    {field === 'rank' && player.rank}
                    {field === 'group' && player.group}
                    {field === 'lastName' && player.lastName}
                    {field === 'firstName' && player.firstName}
                    {field === 'rating' && ''}
                    {field === 'nRating' && player.nRating}
                    {field === 'games' && player.games}
                    {field === 'grade' && player.grade && (
                      <span>{player.group} - {player.firstName} {player.lastName}</span>
                    )}
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
    </div>
  )
}