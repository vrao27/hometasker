// page for user settings - protected route
// This page allows users to update their profile information and change their password.
// It fetches the current user profile on mount and provides forms for updating the name, email, and password.


import { useState, useEffect, FormEvent } from 'react';

const Settings = () => {
  //Form state holds the current input values 
  const [name, setName] = useState('');                   // user’s name
  const [email, setEmail] = useState('');                 // user’s email
  const [currentPassword, setCurrentPassword] = useState(''); // for verifying password change
  const [newPassword, setNewPassword] = useState('');     // the new password

  // Loading and error state
  const [loading, setLoading] = useState(false);          // shows loading indicator
  const [error, setError] = useState<string | null>(null);   // error messages
  const [success, setSuccess] = useState<string | null>(null); // success messages

  //load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // read JWT from localStorage
        const API = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem('accessToken');
        // fetch /api/auth/me with Authorization header
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}`}
        });
        if (!res.ok) throw new Error('Could not load profile');
        // parse JSON and populate form fields
        const data = await res.json();
        setName(data.name);
        setEmail(data.email);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []); // empty deps to run once on component mount

  //Handler functions for form submission 
  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const API = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }), // send updated fields
      });
      if (!res.ok) {
        // handle error response
        const errData = await res.json();
        throw new Error(errData.message || 'Update failed');
      }
      setSuccess('Profile updated.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Important - this function handles the password change
  // It requires both the current and new password to be filled in.
  // It sends a PUT request to the /api/auth/me/password endpoint with the current and new password.
  const handlePasswordSave = async (e: FormEvent) => {
    e.preventDefault(); // prevent page reload
    // require both fields
    if (!currentPassword || !newPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const API = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API}/api/auth/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Password update failed');
      }
      setSuccess('Password changed successfully.');
      // clear password fields after success
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Render the settings page
  // It includes a form for updating the profile and another for changing the password.
  // It shows loading, error, and success messages based on the state.
  return (
    <main className="container py-4" style={{ maxWidth: 600 }}>
      <h1>Settings</h1>

      {/* Show loading spinner or message */}
      {loading && <p>Loading…</p>}
      {/* Show error message in red */}
      {error && <p className="text-danger">{error}</p>}
      {/* Show success message in green */}
      {success && <p className="text-success">{success}</p>}

      {/* Profile update form */}
      <form onSubmit={handleProfileSave} className="mb-4">
        <h2>Profile</h2>

        {/* Name field */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Email field */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Save Profile
        </button>
      </form>

      {/* Password change form */}
      <form onSubmit={handlePasswordSave}>
        <h2>Change Password</h2>

        {/* Current password */}
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>

        {/* New password */}
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-secondary" disabled={loading}>
          Change Password
        </button>
      </form>
    </main>
  );
};

export default Settings;
