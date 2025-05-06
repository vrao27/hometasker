// This file contains the scoreboard service that interacts with the backend API to fetch and update the scoreboard data.
// It defines the ScoreEntry interface and functions to get and update the scoreboard.

export interface ScoreEntry {
    name: string;
    points: number;
  }

// Define the base URL for the scoreboard API
const API = process.env.REACT_APP_API_URL;
const BASE = `${API}/api/scoreboard`;

    // Function to get the scoreboard data
/**
 * GET /api/scoreboard
 * Returns a list of users with their aggregated points.
 */
export async function getLeaderboard(): Promise<ScoreEntry[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Unable to fetch leaderboard');
    return res.json();
  }