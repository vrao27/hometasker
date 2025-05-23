import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  


const Signup: React.FC = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation
  // Controlled inputs for name, email, password 
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state for button

  // Handles form submission
  // Call backend signup route and handle response
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    // password validation regex
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!strongPasswordRegex.test(password)) {
      toast.error(
        'Password must be at least 6 characters long and contain uppercase, lowercase, and a number.'
      );
      setLoading(false);
      return;
    }

    try {
      // POST to your backend signup route 
      const API = process.env.REACT_APP_API_URL;
      const resp = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ name, email, password }), 
      });
      const data = await resp.json();

      if (!resp.ok) {
        // Backend returned an error
        toast.error(data.message || 'Signup failed');
      } else {
        // Success! Store token & redirect
        localStorage.setItem('token', data.accessToken);
        toast.success('Account created!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Full-screen pastel auth background*/
    <div className="auth-background">
      
      {/* Centered pastel-white card */}
      <div
        className="card bg-card shadow-sm rounded-3 p-4 auth-card"
        style={{ width: '100%', maxWidth: '400px' }}>
        
        {/* App title above the gradient banner */}
        <h1 className="app-title text-center">HomeTasker</h1>




        {/* Gradient header/banner for form */}
        <div className="header-banner text-center py-8 mb-4">
          <h2 className="h5 mb-0 text-black">📝 Sign Up</h2>
        </div>

        {/* Signup form  */}
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            className="form-control rounded-pill mb-3"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

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
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$"
            title="Password must be at least 6 characters, include uppercase, lowercase, and a number."
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success rounded-pill w-100"
            disabled={loading}
          >
            {loading ? 'Signing up…' : 'Create Account'}
          </button>
        </form>

        {/* ─── Switch to login link ───────────────────────── */}
        <p className="text-center mt-3">
          Already have an account?{' '}
          <span
            role="button"
            className="text-black"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;


  