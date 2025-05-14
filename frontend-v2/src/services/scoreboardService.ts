// This file contains the scoreboard service that interacts with the backend API to fetch and update the scoreboard data.
// It defines the ScoreEntry interface and functions to get and update the scoreboard.

export interface ScoreEntry {
  id: string; // Add a unique identifier for each score entry
    name: string;
    points: number;
  }

// Define the base URL for the scoreboard API
const API = process.env.REACT_APP_API_URL;
const BASE = `${API}/api/tasks/leaderboard`;



    // Function to get the scoreboard data
/**
 * GET /api/tasks/leaderboard
 * Returns a list of users with their aggregated points.
 */
export async function getLeaderboard(): Promise<ScoreEntry[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE
    , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    );
    if (!res.ok) throw new Error('Unable to fetch leaderboard');
  
  const data = await res.json();

  return (data as any[]).map((e, idx) => ({
  //  • id: try to use Mongo’s `_id`, then any `id` property,
  //        and if neither exists fall back to the array index
  id: e._id ?? e.id ?? String(idx),
  //  • name & points: copy over directly
  name: e.name,
  points: e.points,
}));
 }