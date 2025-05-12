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
    await createTask(title, newPoints); // send pounts and title
    setNewTitle('');
    setNewPoints(1)// reset to default value
    await loadTasks(); // refresh list
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
  <div className="container py-4">
    <h1>Welcome to HomeTasker!</h1>

    {/* — Add Task Form — */}
    <div className="card shadow-sm p-4 mb-4">
  <h5 className="mb-3">Add New Task</h5>
  <form className="row g-2 align-items-end" onSubmit={handleAdd}>
    <div className="col-sm-6">
      <label className="form-label">Task Title</label>
      <input
        type="text"
        className="form-control"
        placeholder="New task title…"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
      />
    </div>
    <div className="col-sm-3">
      <label className="form-label">Points</label>
      <input
        type="number"
        min={1}
        className="form-control"
        value={newPoints}
        onChange={e => setNewPoints(Number(e.target.value))}
      />
    </div>
    <div className="col-sm-3">
      <button type="submit" className="btn btn-primary w-100">
        Add Task
      </button>
    </div>
  </form>
</div>

    {/* — Loading & Error States — */}
    {loading && (
  <div className="d-flex justify-content-center py-2">
    <div className="spinner-border text-primary" role="status" />
  </div>
)}
 {error && (
  <div className="alert alert-danger" role="alert">
    {error}
  </div>
)}

    

    {/* — Task List — */}
    {!loading && !error && (
      tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
       
        <ul className="list-group">
        {tasks.map(task => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span className={task.completed ? 'text-decoration-line-through' : ''}>
                {task.title}
              </span>
              <span className="badge bg-info text-dark ms-2">{task.points} pts</span>
            </div>
            <div>
              {!task.completed && (
                <button className="btn btn-success btn-sm me-2" onClick={() => handleComplete(task.id)}>
                  Complete
                </button>
              )}
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      
          
          
          
      )
    )}
  </div>
);

}

export default Dashboard;
