import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/navbar.jsx';
import Dashboard from './pages/AdminDashboard.jsx';
import UserContext from './context/userContext.jsx';
import NewsDetails from './pages/NewsDetails.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import Profile from './pages/Profile.jsx';
import SavedArticles from './pages/SavedArticles.jsx';
import axios from 'axios';

// When developing locally, use localhost. When live, use your future Render URL.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const App = () => {
  const { user, loading } = React.useContext(UserContext); 

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }
  
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Checks if the secure context user exists AND is an admin */}
        <Route 
          path="/dashboard" 
          element={user && (user.isAdmin || user.isSuperAdmin) ? <Dashboard /> : <Navigate to="/" />} 
        />
        
        {/* Saved Articles route moved inside the main block and matched to the Navbar link */}
        <Route 
          path="/saved" 
          element={user ? <SavedArticles /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
};

export default App;