// src/AddTask.tsx
import React, { useState, FormEvent } from 'react';
import { createTask } from '../services/taskService';
import { useNavigate } from 'react-router-dom';

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createTask(title.trim(), points);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="card bg-mint shadow-sm rounded-3 mx-auto"
        style={{ maxWidth: 400 }}
      >
        <div className="header-banner">
          <h3 className="h5 mb-0">Add Task</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="taskName" className="form-label">
                Task Name
              </label>
              <input
                id="taskName"
                type="text"
                className="form-control game-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter task title…"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="taskPoints" className="form-label">
                Points
              </label>
              <input
                id="taskPoints"
                type="number"
                className="form-control game-input"
                min={1}
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
                required
              />
            </div>

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
                className="btn game-btn-success w-100"
              >
                Add Task
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
