import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../context/userContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  let { login } = React.useContext(UserContext);
  let navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, formData);
      
      // Pass BOTH the user profile data and the token to your context
      login(response.data, response.data.token);
      
      navigate('/');
    } catch (error) {
      alert(
        'Login failed: ' +
        (error.response ? error.response.data : error.message)
      );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        padding: '20px',
        transition: 'background-color 0.3s'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          background: 'var(--bg-primary)',
          border: 'var(--border-thick)',
          borderRadius: '4px',
          transition: 'background-color 0.3s, border-color 0.3s'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="headline-lg" style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Welcome Back.
          </h1>
          <p className="body-text" style={{ fontSize: '14px', margin: 0 }}>
            Log in to access your saved stories and personalized feed.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Email */}
          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'var(--border-thin)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-thin)'}
            />
          </div>

          {/* Password */}
          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'var(--border-thin)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-thin)'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              marginTop: '12px',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Log In
          </button>
        </form>

        {/* Register Redirect Link */}
        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: 'var(--border-thin)' }}>
          <p className="body-text" style={{ fontSize: '13px', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--text-primary)', fontWeight: '700', textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;