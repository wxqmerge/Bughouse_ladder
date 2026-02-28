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
  const [sortBy, setSortBy] = useState<'rank' | 'nRating' | 'rating' | 'byName' | null>(null);
  const [hasData, setHasData] = useState(false);
  const [projectName, setProjectName] = useState<string>('Bughouse Chess Ladder');
  const [lastFile, setLastFile] = useState<File | null>(null);
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
         gameResults: [],
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
         gameResults: [],
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
         gameResults: [],
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
         gameResults: [],
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
         gameResults: [],
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
         gameResults: [],
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
         gameResults: [],
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
          const playersWithResults = parsed.map((player: any) => ({
            ...player,
            gameResults: player.gameResults || new Array(31).fill(null)
          }));
          setPlayers(playersWithResults);
          setHasData(true);
          setSortBy(null);
          return;
        }
      } catch (err) {
        console.error('Failed to parse players:', err);
      }
    }

    setPlayers(samplePlayers);
    setHasData(false);
    setSortBy(null);
  }, []);

   const loadPlayers = (file?: File) => {
      const fileToLoad = file || lastFile;

     if (!fileToLoad) {
       return;
     }

     const projectName = fileToLoad.name.replace(/\.[^.]+$/, '');
     setProjectName(projectName);
     setLastFile(fileToLoad);
     setHasData(false);
     setSortBy(null);

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
          nRating: 0,
          grade: cols[6] !== null ? cols[6] : 'N/A',
          games: cols[7] !== null ? parseInt(cols[7]) : 0,
          attendance: cols[8] !== null ? parseInt(cols[8]) : 0,
          phone: cols[9] !== null ? cols[9] : '',
          info: cols[10] !== null ? cols[10] : '',
          school: cols[11] !== null ? cols[11] : '',
          room: cols[12] !== null ? cols[12] : '',
          gameResults: [],
        };

        if (parseInt(String(player.rank)) > 0 && (player.lastName || player.firstName || player.nRating !== 0))
        {
          loadedPlayers.push(player);
        }

        const gameResults: (string | null)[] = [];
        for (let g = 0; g < numRounds; g++) {
          gameResults.push(cols[13 + g]);
        }
        player.gameResults = gameResults;
      }

       // Max 200 players limit
        if (loadedPlayers.length > 200) {
          loadedPlayers = loadedPlayers.slice(0, 200);
        }

          if (loadedPlayers.length > 0) {
             const numRounds = 31;
             localStorage.clear();
             setHasData(true);

            if (sortBy === 'rank') {
              loadedPlayers.sort((a, b) => a.rank - b.rank);
            } else if (sortBy === 'nRating') {
              loadedPlayers.sort((a, b) => {
                const ratingA = a.nRating || 0;
                const ratingB = b.nRating || 0;
                if (ratingA !== ratingB) {
                  return ratingB - ratingA;
                }
                return a.rank - b.rank;
              });
            } else if (sortBy === 'rating') {
              loadedPlayers.sort((a, b) => {
                const ratingA = a.rating || 0;
                const ratingB = b.rating || 0;
                if (ratingA !== ratingB) {
                  return ratingB - ratingA;
                }
                return a.rank - b.rank;
              });
            } else if (sortBy === 'byName') {
              loadedPlayers.sort((a, b) => Chess_Compare(a, b, 'last', 0));
            }

           const sortedGameResults: (string | null)[][] = [];

           loadedPlayers.forEach(player => {
             const gameResults: (string | null)[] = [];
             for (let g = 0; g < numRounds; g++) {
                gameResults.push(allGameResults[player.rank - 1]?.[g] || null);
              }
              const playerIndex = loadedPlayers.indexOf(player);
              sortedGameResults[playerIndex] = gameResults;
            });

            localStorage.setItem('ladder_players', JSON.stringify(loadedPlayers));
            setPlayers(loadedPlayers);
            setHasData(true);
            setSortBy(null);
        } else {
        }
    };
    
    reader.readAsText(fileToLoad);
  };

    const recalculateRatings = () => {
      const playersCopy = [...players];
      const EloK = 20;

      const calculateActualScore = (gameResults: (string | null)[]) => {
        let score = 0;
        let totalGames = 0;

        gameResults.forEach(result => {
          if (result && result.match(/[WDL]/i)) {
            totalGames++;
            const upperResult = result.toUpperCase();
            if (upperResult === 'W') {
              score += 1;
            } else if (upperResult === 'L') {
              score += 0;
            } else if (upperResult === 'D') {
              score += 0.5;
            }
          }
        });

        return totalGames > 0 ? score / totalGames : 0;
      };

      const calculateExpectedScore = (ratingA: number, playersCopy: PlayerData[], gameResults: (string | null)[]) => {
        let expectedScore = 0;
        let totalGames = 0;

        gameResults.forEach((result, index) => {
          if (result && result.match(/[WDL]/i)) {
            const opponent = playersCopy[index];
            if (opponent && opponent.rating > 0) {
              const expectedScoreForGame = 1 / (1 + Math.pow(10, (opponent.rating - ratingA) / 400));
              expectedScore += expectedScoreForGame;
              totalGames++;
            }
          }
        });

        return totalGames > 0 ? expectedScore / totalGames : 0;
      };

      const calculateNewRating = (oldRating: number, actualScore: number, expectedScore: number, EloK: number) => {
        const newRating = Math.round(oldRating + EloK * (actualScore - expectedScore));
        return Math.max(0, newRating);
      };

      playersCopy.forEach((player) => {
        const gameResults = player.gameResults || new Array(31).fill(null);
        const actualScore = calculateActualScore(gameResults);
        const expectedScore = calculateExpectedScore(player.rating, playersCopy, gameResults);
        const newRating = calculateNewRating(player.rating, actualScore, expectedScore, EloK);
        player.nRating = newRating;
      });

      setPlayers(playersCopy);
      localStorage.setItem('ladder_players', JSON.stringify(playersCopy));
    };

  const Chess_Compare = (Row1: PlayerData, Row2: PlayerData, sortType: 'last' | 'first', _col_sel: number) => {
    const result1 = sortType === 'last' ? Row1.lastName : Row1.firstName;
    const result2 = sortType === 'last' ? Row2.lastName : Row2.firstName;

    if (result1 === '' || result1 === null) {
      return 1;
    }

    if (result2 === '' || result2 === null) {
      return -1;
    }

    if (result1 > result2) {
      return 1;
    }

    if (result1 < result2) {
      return -1;
    }

    return 0;
  };

   const handleSort = (sortMethod: 'rank' | 'nRating' | 'rating' | 'byName') => {
    setSortBy(sortMethod);
    setHasData(true);

    const playersWithResults = players.map((player) => ({
      ...player,
      gameResults: player.gameResults || new Array(31).fill(null)
    }));

    playersWithResults.sort((a, b) => {
      if (sortMethod === 'rank') {
        return a.rank - b.rank;
      } else if (sortMethod === 'nRating') {
        const ratingA = a.nRating || 0;
        const ratingB = b.nRating || 0;
        if (ratingA !== ratingB) {
          return ratingB - ratingA;
        }
        return a.rank - b.rank;
      } else if (sortMethod === 'rating') {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingA !== ratingB) {
          return ratingB - ratingA;
        }
        return a.rank - b.rank;
      } else if (sortMethod === 'byName') {
        const resultA = a.lastName || a.firstName;
        const resultB = b.lastName || b.firstName;
        if (resultA && !resultB) return 1;
        if (!resultA && resultB) return -1;
        if (!resultA && !resultB) return 0;
        if (resultA < resultB) return -1;
        if (resultA > resultB) return 1;
        return 0;
      }
      return 0;
    });

    const sortedPlayers = playersWithResults.map((item, index) => {
      item.rank = index + 1;
      return item;
    });

    setPlayers(sortedPlayers);
    localStorage.setItem('ladder_players', JSON.stringify(sortedPlayers));
   };

   const saveLocalStorage = () => {
    if (players.length === 0) {
      return;
    }

    try {
      localStorage.setItem('ladder_players', JSON.stringify(players));
    } catch (err) {
    }
  };

   const runTests = () => {
     console.log('runTests invoked, reading kings_cross.tab');
     
     const reader = new FileReader();
     reader.onload = (e) => {
       const text = e.target?.result as string;
       const lines = text.split('\n');
       let loadedPlayers: PlayerData[] = [];
       const numRounds = 31;
       
       for (let i = 0; i < lines.length; i++) {
         const line = lines[i].trim();
         
         if (!line) continue;
         
         if (line.startsWith('Group')) continue;
         
         const parts = line.split('\t');
         
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
           nRating: 0,
           grade: cols[6] !== null ? cols[6] : 'N/A',
           games: cols[7] !== null ? parseInt(cols[7]) : 0,
           attendance: cols[8] !== null ? parseInt(cols[8]) : 0,
           phone: cols[9] !== null ? cols[9] : '',
           info: cols[10] !== null ? cols[10] : '',
           school: cols[11] !== null ? cols[11] : '',
           room: cols[12] !== null ? cols[12] : '',
           gameResults: [],
         };

         if (parseInt(String(player.rank)) > 0 && (player.lastName || player.firstName || player.nRating !== 0))
         {
           loadedPlayers.push(player);
         }

         const gameResults: (string | null)[] = [];
         for (let g = 0; g < numRounds; g++) {
           gameResults.push(cols[13 + g]);
         }
         player.gameResults = gameResults;
       }
        
       if (loadedPlayers.length > 0) {
         setPlayers(loadedPlayers);
         localStorage.setItem('ladder_players', JSON.stringify(loadedPlayers));
         recalculateRatings();
         exportPlayers();
       }
     };
     
     reader.readAsText(new File(['kings_cross.tab'], 'kings_cross.tab', { type: 'text/plain' }));
   };

  const exportPlayers = () => {
    if (players.length === 0) {
      console.error('No players to export');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `Export_Results_${timestamp}.txt`;

    const headerLine = 'Group\tLast Name\tFirst Name\tRating\tRnk\tN Rate\tGr\tX\tPhone\tInfo\tSchool\tRoom\t1\t2\t3\t4\t5\t6\t7\t8\t9\t10\t11\t12\t13\t14\t15\t16\t17\t18\t19\t20\t21\t22\t23\t24\t25\t26\t27\t28\t29\t30\t31\Version 1.21';

    let output = headerLine + '\n';

    players.forEach(player => {
      const gameResults = player.gameResults || new Array(31).fill(null);

      output += `${player.group || ''}\t${player.lastName || ''}\t${player.firstName || ''}\t${player.rating > 0 ? player.rating : ''}\t${player.rank}\t${player.nRating > 0 ? player.nRating : ''}\t${player.grade || ''}\t${player.games || 0}\t${player.attendance || ''}\t${player.phone || ''}\t${player.info || ''}\t${player.school || ''}\t${player.room || ''}\t`;

      output += gameResults.map(r => r || '').join('\t');
      output += '\n';
    });

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Exported ${players.length} players to ${filename}`);
  };

  if (!players || players.length === 0) {
    return (
      <div style={{ padding: '2rem', color: '#64748b' }}>
        <h1>{projectName}</h1>
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
          <h1>{projectName} v1.0.0</h1>
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
           <button
             onClick={() => handleSort('rank')}
             style={{
               background: (sortBy === 'rank' && hasData) ? '#8b5cf6' : '#6b7280',
               color: 'white',
               border: '1px solid #4b5563',
               padding: '0.5rem 1rem',
               borderRadius: '9999px',
               cursor: 'pointer',
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.5rem',
               fontSize: '0.875rem',
               outline: '2px solid transparent',
               outlineOffset: '2px',
               fontWeight: sortBy === 'rank' && hasData ? '600' : '400'
             }}
           >
             Sort by Rank
           </button>
           <button
             onClick={() => handleSort('byName')}
             style={{
               background: (sortBy === 'byName' && hasData) ? '#8b5cf6' : '#6b7280',
               color: 'white',
               border: '1px solid #4b5563',
               padding: '0.5rem 1rem',
               borderRadius: '9999px',
               cursor: 'pointer',
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.5rem',
               fontSize: '0.875rem',
               outline: '2px solid transparent',
               outlineOffset: '2px',
               fontWeight: sortBy === 'byName' && hasData ? '600' : '400'
             }}
           >
             Sort by Name
           </button>
           <button
             onClick={() => handleSort('nRating')}
             style={{
               background: (sortBy === 'nRating' && hasData) ? '#8b5cf6' : '#6b7280',
               color: 'white',
               border: '1px solid #4b5563',
               padding: '0.5rem 1rem',
               borderRadius: '9999px',
               cursor: 'pointer',
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.5rem',
               fontSize: '0.875rem',
               outline: '2px solid transparent',
               outlineOffset: '2px',
               fontWeight: sortBy === 'nRating' && hasData ? '600' : '400'
             }}
           >
             Sort by New Rating
           </button>
           <button
             onClick={() => handleSort('rating')}
             style={{
               background: (sortBy === 'rating' && hasData) ? '#8b5cf6' : '#6b7280',
               color: 'white',
               border: '1px solid #4b5563',
               padding: '0.5rem 1rem',
               borderRadius: '9999px',
               cursor: 'pointer',
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.5rem',
               fontSize: '0.875rem',
               outline: '2px solid transparent',
               outlineOffset: '2px',
               fontWeight: sortBy === 'rating' && hasData ? '600' : '400'
             }}
           >
             Sort by Previous Rating
           </button>
        </div>
      </header>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        flexWrap: 'wrap'
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
              if (file) {
                setLastFile(file);
                loadPlayers(file);
              }
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
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
              onClick={exportPlayers}
            >
              Export
            </button>

            <button
              style={{
                background: '#3b82f6',
                color: 'white',
                border: '1px solid #1d4ed8',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
              onClick={runTests}
            >
              Run Tests
            </button>

            <button
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              onClick={saveLocalStorage}
            >
              Save
            </button>

             <button
               style={{
                 background: '#8b5cf6',
                 color: 'white',
                 border: 'none',
                 padding: '0.5rem 1rem',
                 borderRadius: '0.25rem',
                 cursor: 'pointer'
               }}
               onClick={recalculateRatings}
             >
               Recalculate Ratings
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
           onClick={() => setIsWide(!isWide)}
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

             <button
               style={{
                 background: '#3b82f6',
                 color: 'white',
                 border: '1px solid #1d4ed8',
                 padding: '0.5rem 1rem',
                 borderRadius: '0.25rem',
                 cursor: 'pointer',
                 display: 'inline-flex',
                 alignItems: 'center',
                 gap: '0.5rem',
                 fontSize: '0.875rem'
               }}
               onClick={runTests}
             >
               Run Tests
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
      }} />

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
                const gameResults = player.gameResults || new Array(31).fill(null);

               return (
                 <tr key={row} style={{
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
                                {field === 'rating' && player.rating > 0 ? player.rating : ''}
                                {field === 'nRating' && player.nRating > 0 ? player.nRating : ''}
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
                             setPlayers(prevPlayers => {
                               const updatedPlayers = [...prevPlayers];
                               const index = player.rank - 1;
                               if (updatedPlayers[index]) {
                                 const newGameResults = [...updatedPlayers[index].gameResults];
                                 newGameResults[gCol] = value;
                                 updatedPlayers[index] = { ...updatedPlayers[index], gameResults: newGameResults };
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