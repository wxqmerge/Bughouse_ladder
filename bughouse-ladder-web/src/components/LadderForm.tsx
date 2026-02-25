import { useState, useEffect, useRef } from 'react';
import type { PlayerData } from '../utils/hashUtils';
import { Settings as SettingsIcon } from 'lucide-react';
import '../css/index.css';

interface LadderFormProps {
  setShowSettings?: (show: boolean) => void;
}

export default function LadderForm({ setShowSettings }: LadderFormProps = {}) {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isWide, setIsWide] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setPlayers(samplePlayers);
  }, []);

  const loadPlayers = (file?: File) => {
    const fileToLoad = file || fileInputRef.current?.files?.[0];
    
    if (!fileToLoad) {
      alert('Please select a text file to load.');
      return;
    }

        const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      let loadedPlayers: PlayerData[] = [];
      const allGameResults: (string | null)[][] = [];
      const numRounds = 31;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line) continue;
        
        if (line.startsWith('Group')) continue;
        
        const parts = line.split('\t');
        //if (parts.length < 14) continue;  // Need at least columns 0-13

        const lastChar = parts[parts.length - 1];
        const hasTail = lastChar === '' ? parts.length - 1 : parts.length;
        
        const cols: (string | null)[] = [];
        for (let j = 0; j < parts.length && j < hasTail; j++) {
          let value: string | null = parts[j].trim() || null;
          if (j === parts.length - 1 && value === '' && lastChar === '') {
            const prevChar = parts[Math.max(0, parts.length - 2)];
            if (prevChar.match(/^\d+$/)) {
              value = prevChar.slice(0, -1).trim() || null;
            }
          }
          
          cols.push(value);
        }

        const player: PlayerData = {
          rank: cols[4] ? parseInt(cols[4]) : 0,
          group: cols[0] && cols[0].trim() !== '' ? cols[0].trim() : '',
          lastName: cols[1] !== null ? cols[1] : '',
          firstName: cols[2] !== null ? cols[2] : '',
          rating: cols[3] ? parseInt(String(cols[3]).trim() || '-1') : -1,
          nRating: cols[5] !== null && cols[5] !== '' ? parseInt(cols[5]) : 0,
          grade: cols[6] !== null ? cols[6] : 'N/A',
          games: cols[7] !== null ? parseInt(cols[7]) : 0,
          attendance: cols[8] !== null ? parseInt(cols[8]) : 0,
          phone: cols[9] !== null ? cols[9] : '',
          info: cols[10] !== null ? cols[10] : '',
          school: cols[11] !== null ? cols[11] : '',
          room: cols[12] !== null ? cols[12] : '',
        };

        if (parseInt(String(player.rank)) > 0 && (player.lastName || player.firstName || player.nRating !== 0)) 
        {
          loadedPlayers.push(player);
        }

        const gameResults: (string | null)[] = [];
        for (let g = 0; g < numRounds; g++) {
          gameResults.push(cols[13 + g]);
        }
        allGameResults.push(gameResults);
      }

       // Max 200 players limit
       if (loadedPlayers.length > 200) {
         loadedPlayers = loadedPlayers.slice(0, 200);
       }

       if (loadedPlayers.length > 0) {
         loadedPlayers.sort((a, b) => a.rank - b.rank);
        localStorage.setItem('ladder_players', JSON.stringify(loadedPlayers));
        localStorage.setItem('ladder_game_results', JSON.stringify(allGameResults));
        setPlayers(loadedPlayers);
        alert(`Successfully loaded ${loadedPlayers.length} players from ${fileToLoad.name}`);
      } else {
        alert('No valid player data found in the file.');
      }
    };
    
    reader.readAsText(fileToLoad);
  };

  const savePlayers = () => {
    if (players.length === 0) {
      alert('No players to save.');
      return;
    }

    let output = '';
    const gameResultsStr = localStorage.getItem('ladder_game_results');
    const allGameResults: (string | null)[][] = gameResultsStr ? JSON.parse(gameResultsStr) : [];

    for (let i = 0; i < Math.max(players.length, allGameResults.length); i++) {
      const player = players[i];
      const gameResults = allGameResults[i] || new Array(20).fill('');

      output += `${player.group}\t${player.lastName}\t${player.firstName}\t${player.rating}\t${player.rank}\t${player.nRating}\t${player.grade}\t${player.games}\t${player.attendance}\t${player.phone}\t${player.info}\t${player.school}\t${player.room}\t`;
      output += gameResults.map(r => r || '').join('\t');
      output += '\n';
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'players.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Players saved as players.txt');
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
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1>Bughouse Chess Ladder v1.0.0</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Total Players</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{players.length}</div>
          </div>
          {setShowSettings && (
            <button
              onClick={() => setShowSettings(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <SettingsIcon size={18} />
              Settings
            </button>
          )}
        </div>
      </header>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem'
      }}>
        <label
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            display: 'inline-block'
          }}
        >
          Load
          <input
            type="file"
            ref={fileInputRef}
            accept=".txt,.tab,.xls"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) loadPlayers(file);
            }}
          />
        </label>

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
            background: isAdmin ? '#ef4444' : 'white',
            color: isAdmin ? 'white' : 'black',
            border: '1px solid #cbd5e1',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          onClick={() => setIsAdmin(!isAdmin)}
        >
          {isAdmin ? 'Exit Admin' : 'Admin Mode'}
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
              <th key="head-rank" style={{
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                fontWeight: '500',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0f172a',
                color: 'white'
              }}>
                Rnk
              </th>
              <th key="head-group" style={{
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                fontWeight: '500',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0f172a',
                color: 'white'
              }}>
                Group
              </th>
              <th key="head-lastName" style={{
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                fontWeight: '500',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0f172a',
                color: 'white'
              }}>
                Last Name
              </th>
              <th key="head-firstName" style={{
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                fontWeight: '500',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0f172a',
                color: 'white'
              }}>
                First Name
              </th>
              <th key="head-rating" style={{
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                fontWeight: '500',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0f172a',
                color: 'white'
              }}>
                Previous Rating
              </th>
              <th key="head-nRating" style={{
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                fontWeight: '500',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0f172a',
                color: 'white'
              }}>
                New Rating
              </th>
              {Array.from({ length: 31 }).map((_, round) => (
                <th key={`head-round-${round}`} style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: 'center',
                  fontWeight: '500',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: '#0f172a',
                  color: 'white'
                }}>
                  Round {round + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, row) => {
              const gameResultsStr = localStorage.getItem('ladder_game_results');
              const allGameResults: (string | null)[][] = gameResultsStr ? JSON.parse(gameResultsStr) : [];
              const gameResults = allGameResults[player.rank - 1] || new Array(20).fill('');

              return (
                <tr key={player.rank} style={{
                  backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent'
                }}>
                            {Object.keys(player).filter((_, i) => i < 6).map((field, col) => {
                            const isEditable = isAdmin && field !== 'rank';
                            return (
                              <td
                                key={`${row}-${col}`}
                                contentEditable={isEditable}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                  if (isEditable && e.target.textContent) {
                                    const value = e.target.textContent;
                                    setPlayers(prevPlayers => {
                                      const updatedPlayers = [...prevPlayers];
                                      const index = player.rank - 1;
                                      if (updatedPlayers[index]) {
                                        switch (field) {
                                          case 'group': updatedPlayers[index].group = value; break;
                                          case 'lastName': updatedPlayers[index].lastName = value; break;
                                          case 'firstName': updatedPlayers[index].firstName = value; break;
                                          case 'rating': updatedPlayers[index].rating = parseInt(value) || 0; break;
                                          case 'nRating': updatedPlayers[index].nRating = parseInt(value) || 0; break;
                                        }
                                      }
                                      return updatedPlayers;
                                    });
                                    localStorage.setItem('ladder_players', JSON.stringify(players.map((p, i) => i === player.rank - 1 ? ({ ...p, [field]: field === 'rating' || field === 'nRating' ? parseInt(e.target.textContent) : e.target.textContent } as any) : p)));
                                  }
                                }}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  borderBottom: '1px solid #e2e8f0',
                                  verticalAlign: 'middle',
                                  borderRight: "1px solid #e2e8f0",
                                  backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent',
                                }}
                              >
                                {field === 'rank' && player.rank}
                                {field === 'group' && player.group}
                                {field === 'lastName' && player.lastName}
                                {field === 'firstName' && player.firstName}
                                {field === 'rating' && player.rating > 0 ? player.rating : '-'}
                                {field === 'nRating' && player.nRating > 0 ? player.nRating : '-'}
                              </td>
                            );
                          })}
                  {gameResults.map((result, gCol) => {
                    const isEditable = isAdmin;
                    return (
                      <td
                        key={`game-${row}-${gCol}`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                          if (isEditable && e.target.textContent) {
                            const value = e.target.textContent;
                            const newAllGameResults = allGameResults.map((r, i) => i === player.rank - 1 ? [...gameResults] : r);
                            newAllGameResults[player.rank - 1][gCol] = value;
                            player.rank - 1;
                            localStorage.setItem('ladder_game_results', JSON.stringify(newAllGameResults));
                            setPlayers(prevPlayers => {
                              const updatedPlayers = [...prevPlayers];
                              const index = player.rank - 1;
                              if (updatedPlayers[index]) {
                                updatedPlayers[index] = { ...updatedPlayers[index], games: updatedPlayers[index].games + (result ? 0 : 1) };
                              }
                              return updatedPlayers;
                            });
                          }
                        }}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderBottom: '1px solid #e2e8f0',
                          verticalAlign: 'middle',
                          borderRight: "1px solid #e2e8f0",
                          backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent',
                          fontSize: '0.75rem'
                        }}
                      >
                        {result ? result : ''}
                      </td>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 20 - gameResults.length) }).map((_, emptyCol) => (
                    <td key={`empty-${row}-${emptyCol}`} style={{
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid #e2e8f0',
                      verticalAlign: 'middle',
                      backgroundColor: row % 2 >= 1 ? '#f8fafc' : 'transparent'
                    }}></td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}