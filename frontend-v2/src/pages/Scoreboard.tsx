// Scoreboard.tsx
// This component fetches and displays the weekly leaderboard from the server.
// It uses getLeaderboard() to fetch entries and getMe() to highlight the current user.
// Error, loading, and empty states are all handled gracefully.
// Styling uses the pastel “bg-card” wrapper, gradient “header-banner,” and “game-table” utilities.

import React, { useState, useEffect } from 'react';
import { ScoreEntry, getLeaderboard } from '../services/scoreboardService';
import { getMe } from '../services/authService';

const Scoreboard: React.FC = () => {
  // ─── State ─────────────────────────────────────────────────────
  const [entries, setEntries] = useState<ScoreEntry[]>([]);        // Leaderboard entries
  const [loading, setLoading] = useState<boolean>(false);         // Loading spinner flag
  const [error, setError] = useState<string | null>(null);        // Error message
  const [meId, setMeId] = useState<string>('');                   // Current user’s ID

  // ─── Data Fetching Helpers ──────────────────────────────────────
  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();                         // Fetch top entries
      setEntries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // ─── Effects ───────────────────────────────────────────────────
  useEffect(() => {
    // Fetch current user info for row highlighting
    getMe()
      .then((u) => setMeId(u._id))
      .catch(console.error);
    // Fetch leaderboard entries
    loadLeaderboard();
  }, []); // run once on mount

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="container py-4">
      {/* ─── Pastel card wrapper ──────────────────────────────── */}
      <div
        className="card bg-card shadow-sm rounded-3 mx-auto"
        style={{ maxWidth: 800 }}
      >
        {/* ─── Gradient header/banner ─────────────────────────── */}
        <div className="header-banner">
          <h1 className="h4 mb-0 text-white">Scoreboard</h1>
        </div>

        {/* ─── Card body ─────────────────────────────────────── */}
        <div className="card-body">
          {/* Error alert */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Loading spinner */}
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success" role="status" />
            </div>
          ) : (
            <>
              {/* Responsive wrapper for horizontal overflow */}
              <div className="table-responsive">
                {/* ─── Pastel-styled leaderboard table ─────────── */}
                <table className="game-table mb-0">
                  <thead>
                    <tr className="game-table-header">
                      <th style={{ width: '10%' }}>#</th>
                      <th>Player</th>
                      <th className="text-end" style={{ width: '25%' }}>
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, idx) => (
                      <tr
                        key={entry.id}
                        className={
                          entry.id === meId ? 'highlight-row' : ''
                        } /* Highlight “me” */
                      >
                        <td>{idx + 1}</td>             {/* Rank */}
                        <td>{entry.name}</td>          {/* Player name */}
                        <td className="text-end">
                          {entry.points}
                        </td>                         {/* Points */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
