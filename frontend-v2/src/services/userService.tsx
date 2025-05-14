// src/services/userService.ts

const API = process.env.REACT_APP_API_URL;
const BASE = `${API}/api/users`;

// Simple User interface
export interface User {
  _id: string;
  name: string;
}

// Fetch everyone in the household
export async function getHouseholdMembers(): Promise<User[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authorization token is missing');

  const res = await fetch(`${BASE}/household`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Unable to fetch household members');
  return res.json();
}
