// src/services/authService.ts

const API = process.env.REACT_APP_API_URL;


const USER_BASE = `${API}/api/users`;

//Read the JWT from localStorage in one place.
export function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Fetch the current user’s profile.
 * GET /api/users/me
 */

export async function getMe(): Promise<{ _id: string; name: string }> {
  const token = getToken();
  if (!token) throw new Error('Authorization token is missing');

  
    // NOTE: /api/users/me is the actual route for “Who am I?”
    const res = await fetch(`${USER_BASE}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Unable to fetch current user');
  return res.json();
}
