
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // keep toast only


const Login: React.FC = () => {
  // Router hook to redirect after login - should go to dashboard
  const navigate = useNavigate();

  // Local state for controlled inputs 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state for button

  // Handles form submission - use async function to handle async login
  // Call backend login route and handle response
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      // Call backend login route
      const API = process.env.REACT_APP_API_URL;

      const resp = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        // Show backend error message
        toast.error(data.message || 'Login failed');
      } else {
        // On success: store token and redirect
        localStorage.setItem('token', data.accessToken);
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      // Network or unexpected error
      console.error(err);
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ─── Full-screen pastel auth background ──────────────────── */
    <div className="auth-background">
      {/* ─── Centered pastel-white card ─────────────────────────── */}
      <div
        className="card bg-card shadow-sm rounded-3 p-4 auth-card"
        style={{ width: '100%', maxWidth: '400px' }}
      >
         {/* App title above the gradient banner */}
         <h1 className="app-title text-center">HomeTasker</h1>
        {/*  Gradient header/banner for the form */}
        <div className="header-banner text-center py-3 mb-4">
          <h2 className="h5 mb-0 text-white">🔑 Log In</h2>
        </div>

        {/* ─── Login form ─────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="form-control rounded-pill mb-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            className="form-control rounded-pill mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success rounded-pill w-100"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        {/* ─── Switch to signup link ───── */}
        <p className="text-center mt-3">
          Don’t have an account?{' '}
          <span
            role="button"
            className="text-purple"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
