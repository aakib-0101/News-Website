import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");
  
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('${import.meta.env.VITE_API_URL}/news');
        const data = response.data.news || response.data;
        
        // Force sort by newest date first so the latest news is ALWAYS at the top
        const sortedData = [...data].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        
        setNews(sortedData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesSearch = [item.title, item.description, item.author, item.category].join(" ").toLowerCase().includes(search.toLowerCase());
    
    let matchesTime = true;
    if (timeFilter !== "All Time") {
      const itemDate = new Date(item.createdAt || item.date).getTime();
      const diffHours = (Date.now() - itemDate) / (1000 * 60 * 60);
      if (timeFilter === "Past 24 Hours") matchesTime = diffHours <= 24;
      if (timeFilter === "Past Week") matchesTime = diffHours <= (24 * 7);
      if (timeFilter === "Past Month") matchesTime = diffHours <= (24 * 30);
    }
    return matchesSearch && matchesTime;
  });

  // Limit breaking news strictly to 3 items
  const breakingNews = news.slice(0, 3);
  
  // SMART EDITORIAL DISTRIBUTION
  let carouselArticles = [];
  let sidebarArticles = [];
  let gridArticles = [];

  if (filteredNews.length < 5) {
    carouselArticles = filteredNews.slice(0, 1);
    sidebarArticles = filteredNews.slice(1);
  } else {
    carouselArticles = filteredNews.slice(0, 4);
    sidebarArticles = filteredNews.slice(4, 9);
    gridArticles = filteredNews.slice(9);
  }

  // FIX 1: Auto-rotate the hero article every 3 seconds (was 5s)
  useEffect(() => {
    if (isHoveringHero || carouselArticles.length <= 1) return;
    
    const timer = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % carouselArticles.length);
    }, 3000); 
    
    return () => clearInterval(timer);
  }, [isHoveringHero, carouselArticles.length]);

  const heroArticle = carouselArticles[heroIndex];

  const openArticle = (id) => {
    navigate(`/news/${id}`);
    window.scrollTo(0,0);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setHeroIndex((prev) => (prev + 1) % carouselArticles.length);
  };

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setHeroIndex((prev) => (prev === 0 ? carouselArticles.length - 1 : prev - 1));
  };

  // FIX 2: Helper function to strip raw HTML tags (like <div>, <b>) from the preview text
  const stripHtml = (htmlString) => {
    if (!htmlString) return "";
    return htmlString.replace(/<[^>]*>?/gm, ' '); // Replaces tags with a space
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--font-serif)', fontSize: '24px' }}>Curating today's news...</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <style>{`
        @keyframes subtleFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: subtleFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .sidebar-thumb {
          width: 80px; height: 80px; border-radius: 4px; object-fit: cover; background: var(--bg-tertiary);
          transition: transform 0.3s ease;
        }
        .sidebar-card:hover .sidebar-thumb { transform: scale(1.05); }
        .text-heavy-card {
          background: var(--text-primary); color: var(--bg-primary); padding: 32px; border-radius: 4px;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .text-heavy-card h3 { color: var(--bg-primary) !important; }
        .text-heavy-card .meta-text { color: var(--bg-tertiary); border-color: var(--text-secondary); }
        
        .slider-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.4); color: white; border: none;
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; cursor: pointer; z-index: 10;
          transition: background 0.2s, transform 0.2s;
        }
        .slider-btn:hover { background: rgba(0, 0, 0, 0.7); transform: translateY(-50%) scale(1.1); }
        .slider-btn-left { left: 16px; }
        .slider-btn-right { right: 16px; }
      `}</style>

      {/* 1. Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div style={{ borderBottom: 'var(--border-thin)', background: 'var(--bg-primary)' }}>
          <div className="editorial-container ticker-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 32px' }}>
            <span style={{ background: '#E53E3E', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '4px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, borderRadius: '2px' }}>
              Breaking
            </span>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              <div className="ticker-content" style={{ gap: '40px' }}>
                {[...breakingNews, ...breakingNews].map((item, i) => (
                  <span key={i} onClick={() => openArticle(item._id || item.id)} style={{ fontSize: '13px', fontWeight: '500', cursor: 'pointer' }} className="hover-accent">
                    {item.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="editorial-container" style={{ flexGrow: 1, paddingBottom: '40px' }}>
        
        {/* 2. Utility Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', flexWrap: 'wrap', gap: '16px' }}>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={{ padding: '8px', background: 'var(--bg-secondary)', border: 'var(--border-thin)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none', borderRadius: '4px' }}>
            <option value="All Time">Latest Coverage</option>
            <option value="Past 24 Hours">Past 24 Hours</option>
            <option value="Past Week">Past Week</option>
            <option value="Past Month">Past Month</option>
          </select>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 32px', background: 'transparent', border: 'none', borderBottom: '2px solid var(--text-primary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
            <span style={{ position: 'absolute', left: '4px', top: '10px', color: 'var(--text-muted)' }}>⌕</span>
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2 className="headline-lg">No matching stories found.</h2>
          </div>
        ) : (
          <>
            {/* 3. Hero & Sidebar Grid (65/35) */}
            <div className="section-divider"></div>
            <div className="hero-grid">
              
              {/* Main Feature Slider (Left 65%) */}
              {heroArticle && (
                <article 
                  className="article-card" 
                  onMouseEnter={() => setIsHoveringHero(true)}
                  onMouseLeave={() => setIsHoveringHero(false)}
                >
                  <div key={heroArticle._id || heroArticle.id} className="animate-fade">
                    
                    <div className="img-wrapper" style={{ position: 'relative' }} onClick={() => openArticle(heroArticle._id || heroArticle.id)}>
                      
                      {carouselArticles.length > 1 && (
                        <>
                          <button className="slider-btn slider-btn-left" onClick={handlePrevSlide}>❮</button>
                          <button className="slider-btn slider-btn-right" onClick={handleNextSlide}>❯</button>
                        </>
                      )}

                      <img src={heroArticle.image} alt={heroArticle.title} className="hero-img" onError={(e) => e.target.style.display='none'} />
                    </div>
                    
                    <span className="category-tag">{heroArticle.category}</span>
                    <h1 className="headline-huge" onClick={() => openArticle(heroArticle._id || heroArticle.id)}>{heroArticle.title}</h1>
                    
                    {/* Applied stripHtml here */}
                    <p className="body-text" style={{ fontSize: '17px', margin: '0 0 16px' }}>
                      {stripHtml(heroArticle.description).slice(0, 250)}...
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-thin)', paddingTop: '16px', marginTop: '16px' }}>
                      <span className="meta-text">By {heroArticle.author} · {new Date(heroArticle.createdAt || heroArticle.date || Date.now()).toLocaleDateString()}</span>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {carouselArticles.map((_, idx) => (
                          <span 
                            key={idx} 
                            onClick={(e) => { e.stopPropagation(); setHeroIndex(idx); }} 
                            style={{ 
                              width: '10px', height: '10px', borderRadius: '50%', 
                              background: idx === heroIndex ? 'var(--text-primary)' : 'var(--border-thin)', 
                              cursor: 'pointer', transition: 'background 0.3s' 
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Sidebar (Right 35% with premium thumbnails) */}
              <aside className="sidebar-border" style={{ borderLeft: 'var(--border-thin)', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', borderBottom: 'var(--border-thick)', paddingBottom: '8px', margin: 0, letterSpacing: '0.05em' }}>
                  Trending Now
                </h2>
                {sidebarArticles.map(item => (
                  <article key={item._id || item.id} className="sidebar-card" onClick={() => openArticle(item._id || item.id)} style={{ display: 'flex', gap: '16px', cursor: 'pointer', alignItems: 'center' }}>
                    {item.image && (
                      <div style={{ overflow: 'hidden', flexShrink: 0, borderRadius: '4px' }}>
                        <img src={item.image} alt={item.title} className="sidebar-thumb" onError={(e) => e.target.style.display='none'} />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="category-tag" style={{ marginBottom: '4px' }}>{item.category}</span>
                      <h3 className="headline-md" style={{ fontSize: '15px', margin: '0 0 6px', lineHeight: '1.4' }}>{item.title}</h3>
                      <span className="meta-text" style={{ fontSize: '10px' }}>{new Date(item.createdAt || item.date || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </article>
                ))}
              </aside>
            </div>

            {/* 4. Latest Articles Grid (Mixed Premium Formats) */}
            {gridArticles.length > 0 && (
              <>
                <div className="section-divider" style={{ marginTop: '60px' }}></div>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 32px' }}>
                  Latest Stories
                </h2>
                
                <div className="news-grid">
                  {gridArticles.map((item, index) => {
                    
                    if (!item.image || item.image.trim() === "") {
                      return (
                        <article key={item._id || item.id} className="article-card text-heavy-card" onClick={() => openArticle(item._id || item.id)}>
                          <div>
                            <span className="category-tag" style={{ color: 'var(--bg-tertiary)' }}>{item.category}</span>
                            <h3 className="headline-lg" style={{ fontSize: '24px' }}>"{item.title}"</h3>
                            {/* Applied stripHtml here */}
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--bg-secondary)', marginTop: '16px', lineHeight: '1.6' }}>
                              {stripHtml(item.description).slice(0, 150)}...
                            </p>
                          </div>
                          <span className="meta-text" style={{ borderTop: '1px solid var(--text-secondary)', paddingTop: '16px', marginTop: '32px' }}>
                            By {item.author} · {new Date(item.createdAt || item.date || Date.now()).toLocaleDateString()}
                          </span>
                        </article>
                      );
                    }

                    return (
                      <article key={item._id || item.id} className="article-card" onClick={() => openArticle(item._id || item.id)}>
                        <div className="img-wrapper">
                          <img src={item.image} alt={item.title} className="img-3-2" onError={(e) => e.target.style.display='none'} />
                        </div>
                        <span className="category-tag">{item.category}</span>
                        <h3 className="headline-lg" style={{ fontSize: '20px' }}>{item.title}</h3>
                        {/* Applied stripHtml here */}
                        <p className="body-text" style={{ fontSize: '14px', flexGrow: 1 }}>
                          {stripHtml(item.description).slice(0, 100)}...
                        </p>
                        <span className="meta-text" style={{ borderTop: 'var(--border-thin)', paddingTop: '12px', marginTop: 'auto' }}>By {item.author} · {new Date(item.createdAt || item.date || Date.now()).toLocaleDateString()}</span>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* 5. Compact Newsletter Section */}
        <div style={{ maxWidth: '700px', margin: '80px auto 40px', border: 'var(--border-thick)', padding: '40px 32px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
          <h2 className="headline-lg" style={{ margin: '0 0 12px' }}>The Daily Briefing</h2>
          <p className="body-text" style={{ margin: '0 auto 24px' }}>
            Start your morning with what you need to know. The day's top stories, delivered directly to your inbox.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <input type="email" placeholder="Email address" style={{ flex: 1, padding: '10px 16px', border: '1px solid var(--border-thin)', outline: 'none', borderRadius: '4px', fontFamily: 'var(--font-sans)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            <button style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '10px 24px', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Subscribe
            </button>
          </div>
        </div>

        {/* 6. Footer Layout */}
        <footer style={{ borderTop: 'var(--border-thick)', paddingTop: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: '900', display: 'block', marginBottom: '12px' }}>DailyNews.</span>
              <p className="body-text" style={{ fontSize: '13px', margin: 0 }}>Independent journalism, expertly curated.</p>
            </div>
            <div>
              <h4 className="meta-text" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>About</h4>
              <p className="body-text" style={{ fontSize: '13px', cursor: 'pointer', marginBottom: '8px' }}>Our Company</p>
              <p className="body-text" style={{ fontSize: '13px', cursor: 'pointer', marginBottom: '0' }}>Careers</p>
            </div>
            <div>
              <h4 className="meta-text" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Legal</h4>
              <p className="body-text" style={{ fontSize: '13px', cursor: 'pointer', marginBottom: '8px' }}>Terms of Service</p>
              <p className="body-text" style={{ fontSize: '13px', cursor: 'pointer', marginBottom: '0' }}>Privacy Policy</p>
            </div>
          </div>
          <div style={{ borderTop: 'var(--border-thin)', paddingTop: '24px', textAlign: 'center' }}>
            <span className="meta-text">© {new Date().getFullYear()} DailyNews Media. All rights reserved.</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;