import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importing toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing CSS for toast notifications

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
      const resp = await fetch('http://localhost:5000/api/auth/login', {
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
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100"
         style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
      {/* Toast container to display messages */}
      <ToastContainer position="top-center" />

      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">🔑 Log In</h2>

        <form onSubmit={handleSubmit} className="d-flex flex-column">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account?{' '}
          <span role="button" className="text-primary" style={{ cursor: 'pointer' }}
                onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
