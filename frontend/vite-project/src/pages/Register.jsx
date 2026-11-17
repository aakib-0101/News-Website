import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('${import.meta.env.VITE_API_URL}/user/register', formData)
      .then(response => {
        console.log('Registration successful:', response.data);
        navigate('/login');
      })
      .catch(error => {
        alert(
          'Registration failed: ' +
          (error.response ? error.response.data : error.message)
        ); 
      });
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
            Join DailyNews.
          </h1>
          <p className="body-text" style={{ fontSize: '14px', margin: 0 }}>
            Create an account to save articles and customize your reading experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Name */}
          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
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
              placeholder="Create a password"
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

          {/* Age */}
          <div>
            <label className="meta-text" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Age <span style={{ color: 'var(--text-muted)', textTransform: 'none' }}>(Optional)</span>
            </label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
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
            Create Account
          </button>
        </form>

        {/* Login Redirect Link */}
        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: 'var(--border-thin)' }}>
          <p className="body-text" style={{ fontSize: '13px', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '700', textDecoration: 'none' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;