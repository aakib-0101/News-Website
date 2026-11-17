import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext.jsx';
import axios from 'axios';

const SavedArticles = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [savedNews, setSavedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no user is logged in, stop loading
    if (!user) {
      setLoading(false);
      return;
    }

    const loadBookmarkedArticles = async () => {
      try {
        // Fetch all news from your backend
        const response = await axios.get('${import.meta.env.VITE_API_URL}/news');
        const allNews = response.data.news || response.data;
        
        // Match the full article objects to the raw IDs stored in the user's bookmarks array
        const userBookmarks = user.bookmarks || [];
        const matchedArticles = allNews.filter(article => 
          userBookmarks.some(savedId => String(savedId) === String(article._id || article.id))
        );
        
        setSavedNews(matchedArticles);
      } catch (error) {
        console.error("Error fetching saved articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarkedArticles();
  }, [user]);

  if (loading) {
    return (
      <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-secondary)' }}>Loading your reading list...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <h2 className="headline-md" style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>Please log in to view your saved articles.</h2>
        <button 
          onClick={() => navigate('/login')} 
          style={{ padding: '12px 24px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background-color 0.3s' }}>
      <main className="editorial-container animate-fade-up" style={{ paddingBottom: '80px' }}>
        
        {/* Header Section */}
        <div className="section-divider"></div>
        <div style={{ padding: '40px 0', borderBottom: 'var(--border-thick)', marginBottom: '50px' }}>
          <h1 className="headline-huge" style={{ color: 'var(--text-primary)', margin: '0 0 16px' }}>
            Your Saved Articles
          </h1>
          <p className="body-text" style={{ fontSize: '20px', margin: 0, maxWidth: '600px' }}>
            {savedNews.length} {savedNews.length === 1 ? 'story' : 'stories'} saved for later reading.
          </p>
        </div>

        {savedNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', borderBottom: 'var(--border-thin)' }}>
            <h3 className="headline-md" style={{ color: 'var(--text-primary)' }}>Your reading list is empty</h3>
            <p className="body-text">Click the bookmark icon on any article to save it here.</p>
            <button 
              onClick={() => navigate('/')} 
              style={{ marginTop: '24px', padding: '12px 24px', background: 'transparent', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-thin)'}
            >
              Explore News
            </button>
          </div>
        ) : (
          /* Reusing the global 3-column news-grid class from index.css */
          <div className="news-grid">
            {savedNews.map((item) => (
              <article 
                key={item._id || item.id} 
                className="article-card"
                onClick={() => navigate(`/news/${item._id || item.id}`)}
              >
                <div className="img-wrapper">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="img-3-2"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span className="category-tag">{item.category}</span>
                <h2 className="headline-lg" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>
                  {item.title}
                </h2>
                <div className="meta-text" style={{ borderTop: 'var(--border-thin)', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>By <span style={{ color: 'var(--text-primary)' }}>{item.author || "DailyNews"}</span></span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedArticles;