//use the service to get the tasks and display them in the component

//define the task interface
export interface Task {
    id: string;
    title: string;
    completed: boolean;
  }

  //define base url for all tasks endpoints
  const BASE = '/api/tasks';

  //function to get all tasks and return them in an array of Task objects
  export async function getTasks(): Promise<Task[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Unable to fetch tasks');
    return res.json();
  }

// PUT /api/tasks/:id → creates a new task
export async function createTask(title: string): Promise<Task> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Unable to create task');
    return res.json();  // The new Task object
  }


  //PUT /api/tasks/:id/complete → marks a task as completed
  export async function completeTask(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}/complete`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Unable to complete task');
  }


  //PUT /api/tasks/:id/delete → deletes a task
  export async function deleteTask(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Unable to delete task');
  }