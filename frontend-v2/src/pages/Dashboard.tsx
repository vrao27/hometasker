import React, { useState, useEffect, FormEvent } from 'react';
import {
  Task,
  getTasks,
  createTask,
  claimTask,         // ← import claimTask
  completeTask,
  deleteTask
} from '../services/taskService';
import { getUsers } from '../services/userService'; // fetch household members

const Dashboard: React.FC = () => {
  // State to hold the list of tasks
  // This will be an array of Task objects
  // Task is an interface defined in the taskService.ts file
  // Task interface is imported from the taskService.ts file
  const [tasks, setTasks] = useState<Task[]>([]); // Declares a “state variable” of type T, initialized to initialValue.
  // Text for the “new task” input
  const [newTitle, setNewTitle] = useState<string>(''); // make sure the new title is empty when the component mounts
  const [newPoints, setNewPoints] = useState<number>(1); // make sure the new points is 1 when the component mounts
  const [members, setMembers] = useState<{ _id: string; name: string }[]>([]); // household members
  const [assignedTo, setAssignedTo] = useState<string>(''); // empty = me

  // Loading & error indicators
  const [loading, setLoading] = useState<boolean>(false); // A flag to show “Loading…” while waiting for an API response.
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
    getUsers().then(setMembers); // load household members for the dropdown
  }, []); // empty deps → run only on first render

  // Action Handlers to call service and  reload tasks
  // Add a new task
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();              // stop form from reloading the page
    const title = newTitle.trim();
    if (!title) return;              // ignore empty submissions

    try {
      await createTask(title, newPoints, assignedTo || undefined); // send points, title, and optional assignee
      setNewTitle('');
      setNewPoints(1);               // reset to default value
      setAssignedTo('');             // reset dropdown
      await loadTasks();             // refresh list
    } catch (err: any) {
      setError(err.message || 'Create Task failed');
    }
  };

  // Claim an unassigned task
  const handleClaim = async (_id: string) => {
    try {
      await claimTask(_id);
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Mark a task completed
  const handleComplete = async (_id: string) => {
    try {
      await completeTask(_id);
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a task
  const handleDelete = async (_id: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(_id);
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div
        className="card bg-mint shadow-sm rounded-3 mx-auto"
        style={{ maxWidth: 800 }}
      >
        <div className="header-banner">
          <h1 className="h4 mb-0">Welcome to HomeTasker!</h1>
        </div>
        <div className="card-body">
          {/* — Add Task Form — */}
          <div className="card bg-white shadow-sm rounded-2 p-4 mb-4">
            <h5 className="mb-3">Add New Task</h5>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form
              className="row g-3 align-items-end"
              onSubmit={handleAdd}
            >
              <div className="col-sm-4">
                <label htmlFor="newTask" className="form-label">
                  Task Title
                </label>
                <input
                  id="newTask"
                  type="text"
                  className="form-control game-input"
                  placeholder="New task title…"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="col-sm-2">
                <label htmlFor="newPoints" className="form-label">
                  Points
                </label>
                <input
                  id="newPoints"
                  type="number"
                  min={1}
                  className="form-control game-input"
                  value={newPoints}
                  onChange={(e) =>
                    setNewPoints(Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="assignedTo" className="form-label">
                  Who’s Responsible?
                </label>
                <select
                  id="assignedTo"
                  className="form-select game-input"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Me</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-2">
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <div
                      className="spinner-border text-success"
                      role="status"
                    />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="game-btn game-btn-success w-100"
                  >
                    Add Task
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* — Task List — */}
          {loading && !tasks.length ? (
            <div className="d-flex justify-content-center py-2">
              <div
                className="spinner-border text-success"
                role="status"
              />
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-center">No tasks yet.</p>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => {
                const isMine = task.assignedTo?._id === /* your user’s ID from context */ '';
                return (
                  <li
                    key={task._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span
                        className={
                          task.completed
                            ? 'text-decoration-line-through'
                            : ''
                        }
                      >
                        {task.taskName}
                      </span>
                      <span className="badge-points ms-2">
                        {task.points} pts
                      </span>
                      {task.assignedTo && (
                        <small className="text-muted d-block">
                          Claimed by {task.assignedTo.name}
                        </small>
                      )}
                    </div>
                    <div>
                      {/* Claim if unassigned */}
                      {!task.assignedTo && (
                        <button
                          className="game-btn game-btn-secondary btn-sm me-2"
                          onClick={() => handleClaim(task._id)}
                        >
                          Claim
                        </button>
                      )}
                      {/* Complete/Delete if you’re the assignee */}
                      {isMine && !task.completed && (
                        <button
                          className="game-btn game-btn-secondary btn-sm me-2"
                          onClick={() => handleComplete(task._id)}
                        >
                          Complete
                        </button>
                      )}
                      {isMine && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
