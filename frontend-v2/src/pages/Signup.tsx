import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    //password validation regex
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
if (!strongPasswordRegex.test(password)) {
  toast.error(
    'Password must be atleast 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
  );
  setLoading(false);
  return;
}

    try {
      // POST to your backend signup route 
      const resp = await fetch('http://localhost:5000/api/auth/signup', {
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
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}
    >
      <ToastContainer position="top-center" />

      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">📝 Sign Up</h2>

        <form onSubmit={handleSubmit} className="d-flex flex-column">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            className="form-control mb-3"
            value={name}
            onChange={e => setName(e.target.value)} 
            required
          />

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
            className="form-control mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            //minLength={6}
            pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$'
            title='Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
          />

          {/* Submit Button */}
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Signing up…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{' '}
          <span
            role="button"
            className="text-success"
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
