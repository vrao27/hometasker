import React, { useState, useEffect, FormEvent } from 'react';
import {
  Task,
  getTasks,
  createTask,
  claimTask,
  completeTask,
  deleteTask
} from '../services/taskService';
import { getHouseholdMembers, User } from '../services/userService';
import { getMe } from '../services/authService';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPoints, setNewPoints] = useState<number>(1);
  const [members, setMembers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  // Load tasks + members + current user
    const loadAll = async () => {
      setLoading(true);
      setError(null);

      // 1) Load tasks
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (e: any) {
        console.error('Failed to load tasks:', e);
        setError(prev => (prev ? prev + '; tasks failed' : 'Tasks failed'));
      }

      // 2) Load household members
      try {
        const membersData = await getHouseholdMembers();
        setMembers(membersData);
      } catch (e: any) {
        console.error('Failed to load household members:', e);
        setError(prev => (prev ? prev + '; members failed' : 'Members failed'));
      }

      // 3) Load current user
      try {
        const meData = await getMe();
        setMe(meData);
      } catch (e: any) {
        console.error('Failed to load current user:', e);
        setError(prev => (prev ? prev + '; user failed' : 'User failed'));
      }

      setLoading(false);
    };


  useEffect(() => {
    loadAll();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    try {
      await createTask(title, newPoints, assignedTo || undefined);
      setNewTitle('');
      setNewPoints(1);
      setAssignedTo('');
      await loadAll();
    } catch (err: any) {
      setError(err.message || 'Create Task failed');
    }
  };

  const handleClaim = async (id: string) => { await claimTask(id).then(loadAll).catch(console.error); };
  const handleComplete = async (id: string) => { await completeTask(id).then(loadAll).catch(console.error); };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id).then(loadAll).catch(console.error);
  };

  // Render
  return (
    <div className="container py-4">
      {/* ─── Two-column layout ─── */}
      <div className="row g-4">

        {/* ─── Left column: Add Task form + Rewards panel ─── */}
        <div className="col-lg-4">
          {/* Add Task Card */}
          <div className="card bg-panel shadow-sm rounded-3 p-4 mb-4">
            <h5 className="mb-3">Add New Task</h5>
            <form onSubmit={handleAdd} className="add-task-form row g-3 align-items-end">
              {/* Task Title input */}
              <div className="col-sm-6">
                <label htmlFor="newTask" className="form-label">
                  Task Title
                </label>
                <input
                  id="newTask"
                  type="text"
                  className="form-control"
                  placeholder="New task title…"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>
              {/* Points input */}
              <div className="col-sm-3">
                <label htmlFor="newPoints" className="form-label">
                  Points
                </label>
                <input
                  id="newPoints"
                  type="number"
                  min={1}
                  className="form-control"
                  value={newPoints}
                  onChange={e => setNewPoints(Number(e.target.value))}
                  required
                />
              </div>
              {/* “Who’s Responsible?” dropdown */}
              <div className="col-sm-3">
                <label htmlFor="assignedTo" className="form-label">
                  
                </label>
                <select
                  id="assignedTo"
                  className="form-select"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                >
                  <option value="">— assign to —</option>
                  {members.map(m => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Submit button */}
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? 'Adding…' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>

          {/* Rewards Card */}
          <div className="card bg-panel shadow-sm rounded-3 p-4">
            <h5 className="mb-3">Rewards</h5>
            <ul className="rewards-list">
              <li>
                Movie Night <span className="float-end">5 pts</span>
              </li>
              <li>
                New Book <span className="float-end">8 pts</span>
              </li>
              <li>
                Dessert <span className="float-end">3 pts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Right column: Error, Loading, Task List ─── */}
        <div className="col-lg-8">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && !tasks.length ? (
            <div className="text-center">Loading tasks…</div>

            /* Empty state */
          ) : tasks.length === 0 ? (
            <p className="text-center">No tasks yet.</p>

            /* Task List */
          ) : (
            <ul className="list-group">
              {tasks.map(task => {
                const isMine = me ? task.assignedTo?._id === me._id : false;
                return (
                  <li
                    key={task._id}
                    className="list-group-item bg-card shadow-sm rounded-3 mb-3 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {/* Task name & points */}
                      <span
                        className={
                          task.completed ? 'text-decoration-line-through' : ''
                        }
                      >
                        {task.taskName}
                      </span>
                      <span className="stat-pill ms-2">
                        {task.points} pts
                      </span>
                      {/* Claimed by info */}
                      {task.assignedTo && (
                        <small className="text-muted d-block">
                          Claimed by {task.assignedTo.name}
                        </small>
                      )}
                    </div>
                    <div>
                      {/* Always render Claim button for unassigned, ONLY disable if the task is already asigned*/}
                      {task.status === 'available' && (
                        <button
                          // CHANGED: show Claim only when status==='available'
                          className="btn btn-secondary btn-sm me-2"
                        
                          onClick={() => handleClaim(task._id)}
                        >
                          Claim
                        </button>
                      )}
                      
                    // CHANGED: show Complete only when inProgress and assigned to me
                      {task.status === 'inProgress' && isMine && (
                        <button
                          className="btn btn-secondary btn-sm me-2"
                          onClick={() => handleComplete(task._id)}
                        >
                          Complete
                        </button>
                      )}
                     // CHANGED: show Delete only when assigned to me
                      {isMine && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </button>
                      )}

                      //CHANGED: show Completed badge when status==='completed'
                      {task.status === 'completed' && (
                        <span className="badge bg-success ms-2">Completed</span>
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
}

export default Dashboard;
