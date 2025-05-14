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
    try {
      const [tasksData, membersData, meData] = await Promise.all([
        getTasks(),
        getHouseholdMembers(),
        getMe(),
      ]);
      setTasks(tasksData);
      setMembers(membersData);
      setMe(meData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
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

  const handleClaim    = async (id: string) => { await claimTask(id).then(loadAll).catch(console.error); };
  const handleComplete = async (id: string) => { await completeTask(id).then(loadAll).catch(console.error); };
  const handleDelete   = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id).then(loadAll).catch(console.error);
  };

  return (
    <div className="container py-4">
      {/* … your card wrapper, header, etc. … */}

      {/* — Add Task Form — */}
      <form onSubmit={handleAdd} className="row g-3 align-items-end mb-4">
        {/* Title & points inputs (as you already have) */}
        <div className="col-sm-4">
          <label htmlFor="newTask" className="form-label">Task Title</label>
          <input
            id="newTask"
            type="text"
            className="form-control"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
        </div>
        <div className="col-sm-2">
          <label htmlFor="newPoints" className="form-label">Points</label>
          <input
            id="newPoints"
            type="number"
            min={1}
            className="form-control"
            value={newPoints}
            onChange={(e) => setNewPoints(Number(e.target.value))}
            required
          />
        </div>

        {/* ← New: Assignee dropdown */}
        <div className="col-sm-4">
          <label htmlFor="assignedTo" className="form-label">Who’s Responsible?</label>
          <select
            id="assignedTo"
            className="form-select"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Me</option>
            {members.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="col-sm-2">
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Adding…' : 'Add Task'}
          </button>
        </div>
      </form>

      {/* — Task List — */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && !tasks.length ? (
        <div className="text-center">Loading tasks…</div>
      ) : tasks.length === 0 ? (
        <p className="text-center">No tasks yet.</p>
      ) : (
        <ul className="list-group">
          {tasks.map(task => {
            const isMine = me ? task.assignedTo?._id === me._id : false;
            return (
              <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span className={task.completed ? 'text-decoration-line-through' : ''}>
                    {task.taskName}
                  </span>
                  <span className="badge bg-light ms-2">{task.points} pts</span>
                  {task.assignedTo && (
                    <small className="text-muted d-block">
                      Claimed by {task.assignedTo.name}
                    </small>
                  )}
                </div>
                <div>
                  {!task.assignedTo && (
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleClaim(task._id)}>
                      Claim
                    </button>
                  )}
                  {isMine && !task.completed && (
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleComplete(task._id)}>
                      Complete
                    </button>
                  )}
                  {isMine && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>
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
  );
};

export default Dashboard;

