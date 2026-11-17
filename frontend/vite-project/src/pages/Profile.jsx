import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext.jsx';

const Profile = () => {
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load the user's current data into the form when the page loads
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        password: '' // Keep password blank so they only update it if they type something new
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const token = localStorage.getItem('token');
      
      // Build the update payload. Only include the password if they actually typed a new one.
      const updates = { 
        name: formData.name, 
        email: formData.email, 
        age: formData.age 
      };
      
      if (formData.password.trim() !== '') {
        updates.password = formData.password;
      }

      // Hit the same update route you used in the Admin Dashboard
      await axios.put(`${import.meta.env.VITE_API_URL}/user/update?id=${user._id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the global context immediately so the Navbar changes instantly
      login({ ...user, ...updates }, token);
      
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
      setFormData({ ...formData, password: '' }); // Clear the password field after success
      
    } catch (error) {
      console.error("Profile update error:", error);
      setStatus({ type: 'error', message: error.response?.data || 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', system-ui, sans-serif", padding: '60px 20px' }}>
      
      <style>{`
        .profile-container { max-width: 550px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); overflow: hidden; }
        .profile-header { padding: 32px 40px; border-bottom: 1px solid #E5E7EB; background: #0A0A0A; color: #FFFFFF; text-align: center; }
        .profile-title { font-family: 'Georgia', serif; font-size: 28px; margin: 0 0 8px 0; font-weight: 400; }
        .profile-subtitle { color: #A3A3A3; font-size: 14px; margin: 0; }
        
        .profile-body { padding: 40px; }
        .form-group { margin-bottom: 24px; }
        .form-label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-input { width: 100%; box-sizing: border-box; padding: 12px 16px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 15px; outline: none; transition: all 0.2s ease; font-family: inherit; }
        .form-input:focus { border-color: #000; box-shadow: 0 0 0 1px #000; }
        .form-input::placeholder { color: #9CA3AF; }
        
        .btn-submit { width: 100%; padding: 14px; background: #000000; color: #FFFFFF; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: background 0.2s ease; margin-top: 10px; }
        .btn-submit:hover { background: #262626; }
        .btn-submit:disabled { background: #9CA3AF; cursor: not-allowed; }
        
        .status-message { padding: 12px 16px; border-radius: 6px; font-size: 14px; margin-bottom: 24px; font-weight: 500; }
        .status-success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
        .status-error { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
      `}</style>

      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Account Settings</h1>
          <p className="profile-subtitle">Manage your personal information and security.</p>
        </div>

        <div className="profile-body">
          {status.message && (
            <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;