// Scoreboard.tsx
// This component fetches and displays the leaderboard from the server.
// It uses the getLeaderboard function from the scoreboardService to fetch the data.
// It also handles loading and error states.
// It displays the leaderboard in a table format.
// It uses React hooks to manage state and side effects. 


import React, { useState, useEffect } from 'react';
import { ScoreEntry, getLeaderboard } from '../services/scoreboardService';

const Scoreboard: React.FC = () => {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //Helper func to fetch the leaderboard
  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  //Fetch once on component mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  //Render
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Leaderboard</h2>

      {loading && <p>Loading leaderboard…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        entries.length === 0 ? (
          <p>No scores to show.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.name}</td>
                  <td>{e.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default Scoreboard;