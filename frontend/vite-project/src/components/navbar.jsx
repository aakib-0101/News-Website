import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/userContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const moreRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) setIsMoreOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainCategories = ["Politics", "Business", "Technology", "Entertainment", "Sports"];
  const moreCategories = ["Science", "Environment", "Health", "Other"];
  const allCategories = [...mainCategories, ...moreCategories];

  const isActive = (path) => location.pathname === path;
  const isMoreActive = moreCategories.some(cat => isActive(`/category/${cat.toLowerCase()}`));

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-primary)', borderBottom: 'var(--border-thin)', height: 'var(--header-height)' }}>
      <div className="editorial-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        
        {/* Left: Mobile Toggle & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 25%' }}>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '24px', cursor: 'pointer', padding: 0 }}>
            ☰
          </button>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1px' }}>DailyNews.</span>
          </Link>
        </div>

        {/* Center: Main Categories + More Dropdown */}
        <div className="nav-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', flex: '1 1 50%' }}>
          {mainCategories.map((cat) => (
            <Link key={cat} to={`/category/${cat.toLowerCase()}`} style={{ color: isActive(`/category/${cat.toLowerCase()}`) ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: isActive(`/category/${cat.toLowerCase()}`) ? '2px solid var(--text-primary)' : '2px solid transparent', paddingBottom: '4px', transition: 'color 0.2s' }}>
              {cat}
            </Link>
          ))}
          
          <div ref={moreRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsMoreOpen(!isMoreOpen)} 
              style={{ background: 'none', border: 'none', color: isMoreActive ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', padding: '0 0 4px 0', borderBottom: isMoreActive ? '2px solid var(--text-primary)' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              More <span style={{ fontSize: '10px' }}>▼</span>
            </button>

            {isMoreOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '16px', width: '180px', background: 'var(--bg-primary)', border: '1px solid var(--border-thin)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
                {moreCategories.map((cat) => (
                  <Link 
                    key={cat} 
                    to={`/category/${cat.toLowerCase()}`} 
                    onClick={() => setIsMoreOpen(false)} 
                    style={{ display: 'block', padding: '12px 16px', color: isActive(`/category/${cat.toLowerCase()}`) ? 'var(--accent)' : 'var(--text-primary)', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-thin)' }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Theme, Profile, Log In & Register */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', flex: '1 1 25%' }}>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '18px', cursor: 'pointer' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-thin)', padding: '4px 12px 4px 4px', borderRadius: '30px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'grid', placeItems: 'center', fontWeight: '700', fontSize: '12px' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{user.name?.split(' ')[0]}</span>
              </button>

              {isProfileOpen && (
                <div style={{ position: 'absolute', top: '120%', right: 0, width: '200px', background: 'var(--bg-primary)', border: '1px solid var(--border-thin)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '8px', zIndex: 110 }}>
                  <Link to="/saved" onClick={() => setIsProfileOpen(false)} style={{ display: 'block', padding: '10px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>🔖 Saved Articles</Link>
                  <Link to="/profile" onClick={() => setIsProfileOpen(false)} style={{ display: 'block', padding: '10px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>👤 Edit Profile</Link>
                  {(user.isAdmin || user.isSuperAdmin) && (
                    <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} style={{ display: 'block', padding: '10px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>⚙️ Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); setIsProfileOpen(false); navigate('/login'); }} style={{ width: '100%', textAlign: 'left', padding: '10px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', borderTop: '1px solid var(--border-thin)', marginTop: '8px', fontWeight: '600' }}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Log In</Link>
              <Link to="/register" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Register</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{ position: 'absolute', top: 'var(--header-height)', left: 0, right: 0, background: 'var(--bg-primary)', borderBottom: 'var(--border-thick)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 99, maxHeight: 'calc(100vh - var(--header-height))', overflowY: 'auto' }}>
          {allCategories.map((cat) => (
            <Link key={cat} to={`/category/${cat.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} style={{ color: isActive(`/category/${cat.toLowerCase()}`) ? 'var(--accent)' : 'var(--text-primary)', textDecoration: 'none', fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {cat}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;