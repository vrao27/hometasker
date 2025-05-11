import React, { useState, useEffect, FormEvent } from 'react';
import { Task,getTasks,createTask,completeTask,deleteTask  } from '../services/taskService';

const Dashboard: React.FC = () => {


  // State to hold the list of tasks
  // This will be an array of Task objects
  // Task is an interface defined in the taskService.ts file
  // Task interface is imported from the taskService.ts file
  const [tasks, setTasks] = useState<Task[]>([]); // Declares a “state variable” of type T, initialized to initialValue.
  // Text for the “new task” input
  const [newTitle, setNewTitle] = useState<string>('');//make sure the new title is empty when the component mounts
  const [newPoints, setNewPoints] = useState<number>(1); //make sure the new points is 1 when the component mounts
  // Loading & error indicators
  const [loading, setLoading] = useState<boolean>(false); //A flag to show “Loading…” while waiting for an API response.
  const [error, setError] = useState<string | null>(null);


  //Load tasks helper function
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

    // Fetch tasks once when component mounts
    useEffect(() => {
      loadTasks();
    }, []); // empty deps → run only on first render

// Action Handlers to call service and  reload tasks
// Add a new task 
const handleAdd = async (e: FormEvent) => {
  e.preventDefault();              // stop form from reloading the page
  const title = newTitle.trim();
  if (!title) return;              // ignore empty submissions

  try {
    await createTask(title);
    setNewTitle('');               // clear the input
    await loadTasks();             // refresh list
  } catch (err: any) {
    setError(err.message || 'Create Task failed');
  }
};

// Mark a task completed
const handleComplete = async (id: string) => {
  try {
    await completeTask(id);
    await loadTasks();
  } catch (err) {
    console.error(err);
  }
};

// Delete a task
const handleDelete = async (id: string) => {
  if (!window.confirm('Delete this task?')) return;
  try {
    await deleteTask(id);
    await loadTasks();
  } catch (err) {
    console.error(err);
  }
};

return (
  <div style={{ padding: '2rem' }}>
    <h1>Welcome to HomeTasker!</h1>

    {/* — Add Task Form — */}
    <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem' }}>
      <input
        type="text"
        placeholder="New task title…"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
      />
      <input
          type="number"
          min={1}
          value={newPoints}
          onChange={e => setNewPoints(Number(e.target.value))}
          style={{ width: '4rem', marginLeft: '0.5rem' }}
      />
      <button type="submit" style={{ marginLeft: '0.5rem' }}>
        Add Task
      </button>
    </form>

    {/* — Loading & Error States — */}
    {loading && <p>Loading tasks…</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}

    {/* — Task List — */}
    {!loading && !error && (
      tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </span>
              {!task.completed && (
                <button
                  onClick={() => handleComplete(task.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => handleDelete(task.id)}
                style={{ marginLeft: '0.5rem', color: 'darkred' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )
    )}
  </div>
);

}

export default Dashboard;
