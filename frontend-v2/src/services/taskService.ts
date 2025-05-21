//use the service to get the tasks and display them in the component

//define the task interface
 export interface Task {
  _id: string;
  taskName: string;
  points: number;
  completed: boolean;
  assignedTo: { _id: string; name: string } | null; // The assigned user object or null if not assigned
}


//define base url for all tasks endpoints
const API = process.env.REACT_APP_API_URL;
const BASE = `${API}/api/tasks`;



  //function to get all tasks and return them in an array of Task objects
export async function getTasks(): Promise<Task[]> {

  const token = localStorage.getItem('token');
 
  if (!token) throw new Error('Authorization token is missing');

  const res = await fetch(BASE, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Unable to fetch tasks');
  return await res.json(); // Ensure the response is returned
}

// POST /api/tasks/:id → creates a new task
export async function createTask(taskName: string, points: number, assignedTo?: string ): Promise<Task> {

  const token = localStorage.getItem('token');
  
    const res = await fetch(BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ taskName, points }),
    });
    if (!res.ok) throw new Error('Unable to create task');
    return res.json();  // The new Task object
  }


  //POST /api/tasks/:id/complete → marks a task as completed
export async function completeTask(_id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE}/${_id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response status:", res.status);
    const text = await res.text();
    console.log("Response body:", text);
    if (!res.ok) throw new Error('Unable to complete task');
  }


  //PUT /api/tasks/:id/delete → deletes a task
export async function deleteTask(_id: string): Promise<void> {
  const token = localStorage.getItem('token');
    const res = await fetch(`${BASE}/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  if (!res.ok) throw new Error('Unable to delete task');
}
  
  // POST /api/tasks/:id/assign → “claim” an unassigned task
export async function claimTask(_id: string): Promise<Task> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/${_id}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Unable to claim task');
  return res.json();
}
