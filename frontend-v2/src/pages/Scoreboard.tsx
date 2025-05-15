// Scoreboard.tsx
// This component fetches and displays the leaderboard from the server.
// It uses the getLeaderboard function from the scoreboardService to fetch the data.
// It also handles loading and error states.
// It displays the leaderboard in a table format.
// It uses React hooks to manage state and side effects. 


import React, { useState, useEffect } from 'react';
import { ScoreEntry, getLeaderboard } from '../services/scoreboardService';
import { getMe } from '../services/authService';  

const Scoreboard: React.FC = () => {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    const [meId, setMeId] = useState<string>(''); // State to store the current user's ID

  //Helper func to fetch the leaderboard
  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setEntries(data); // Set the players state with the fetched data
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  //Fetch once on component mount
  useEffect(() => {
    // Fetch the current user's ID
    getMe()
      .then(u => setMeId(u._id))
      .catch(console.error);
    // Fetch the leaderboard data when the component mounts
    loadLeaderboard();
  }, []);

  //Render
  return (
    <div className="container py-4">
      <div
        className="card bg-mint shadow-sm rounded-3 mx-auto"
        style={{ maxWidth: 800 }}
      >
        <div className="header-banner">
          <h1 className="h4 mb-0">Scoreboard</h1>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success" role="status" />
            </div>
          ) : (
            <table className="table game-table">
              <thead>
                <tr className="game-table-header">
                  <th>#</th>
                  <th>Player</th>
                  <th className="text-end">Points</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={idx === 0 ? 'highlight-row' : ''}
                  >
                    <td>{idx + 1}</td>
                    <td>{entry.name}</td>
                    <td className="text-end">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;