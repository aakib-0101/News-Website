import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8; // Adjust for 4-column grid (e.g., 8, 12)

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then((response) => response.json())
      .then((data) => {
        setNews(data.news || data);
        setLoading(false);
      }) 
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, []);

  // Reset pagination when the category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryName]);

  const mainCategories = ['politics', 'technology', 'sports', 'business', 'entertainment'];

  const categoryNews = news.filter((item) => {
    const itemCat = (item.category || "").toLowerCase();
    const targetCat = categoryName.toLowerCase();

    if (targetCat === 'other') {
      return !mainCategories.includes(itemCat);
    } else {
      return itemCat === targetCat;
    }
  });

  const totalPages = Math.ceil(categoryNews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = categoryNews.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-secondary)' }}>Curating stories...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px', transition: 'background-color 0.3s' }}>
      <main className="editorial-container animate-fade-up">
        
        {/* Editorial Page Header */}
        <div className="section-divider"></div>
        <div style={{ padding: '40px 0', borderBottom: 'var(--border-thick)', marginBottom: '50px' }}>
          <h1 className="headline-huge" style={{ textTransform: 'capitalize', color: 'var(--text-primary)', margin: '0 0 16px' }}>
            {categoryName} News
          </h1>
          <p className="body-text" style={{ fontSize: '20px', margin: 0, maxWidth: '600px' }}>
            The latest independent coverage and breaking updates in {categoryName}.
          </p>
        </div>

        {categoryNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', borderBottom: 'var(--border-thin)' }}>
            <h3 className="headline-md" style={{ color: 'var(--text-primary)' }}>No stories found in this section.</h3>
            <p className="body-text">Check back later for recent updates to our {categoryName} coverage.</p>
          </div>
        ) : (
          /* Reusing the global news-grid class from index.css */
          <div className="news-grid">
            {currentNews.map((item) => (
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
                <p className="body-text" style={{ fontSize: '14px', flexGrow: 1 }}>
                  {item.description?.length > 120 ? item.description.slice(0, 120) + '...' : item.description}
                </p>
                <div className="meta-text" style={{ borderTop: 'var(--border-thin)', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>By <span style={{ color: 'var(--text-primary)' }}>{item.author}</span></span>
                  <span>{formatDate(item.createdAt || item.date)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Editorial Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '80px', paddingTop: '40px', borderTop: 'var(--border-thick)' }}>
            <button 
              onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0,0); }} 
              disabled={currentPage === 1} 
              style={{ 
                padding: '10px 24px', background: 'transparent', border: 'var(--border-thin)', 
                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', 
                fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', 
                letterSpacing: '0.05em', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'border-color 0.2s' 
              }}
              onMouseEnter={(e) => { if(currentPage !== 1) e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-thin)'; }}
            >
              ← Previous
            </button>
            
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0,0); }} 
              disabled={currentPage === totalPages} 
              style={{ 
                padding: '10px 24px', background: 'transparent', border: 'var(--border-thin)', 
                color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)', 
                fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', 
                letterSpacing: '0.05em', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'border-color 0.2s' 
              }}
              onMouseEnter={(e) => { if(currentPage !== totalPages) e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-thin)'; }}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;