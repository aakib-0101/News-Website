import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext.jsx';
import axios from 'axios';

const NewsDetails = ({ news: propNews, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useContext(UserContext);
  const [article, setArticle] = useState(propNews || null);
  const [loading, setLoading] = useState(!propNews);
  
  const [relatedNews, setRelatedNews] = useState([]);
  
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarks?.some(bookmark => 
      (bookmark._id || bookmark) === (article?._id || id)
    ) || false
  );

  useEffect(() => {
    if (!propNews && id) {
      fetch(`${import.meta.env.VITE_API_URL}/news/${id}`)
        .then((response) => {
          if (!response.ok) throw new Error('Article not found');
          return response.json();
        })
        .then((data) => {
          setArticle(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
          setLoading(false);
        });
    }

    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then((res) => res.json())
      .then((data) => {
        const allNews = Array.isArray(data.news || data) ? (data.news || data) : [];
        const filtered = allNews.filter(n => String(n._id || n.id) !== String(id)).reverse().slice(0, 4);
        setRelatedNews(filtered);
      })
      .catch((err) => console.error("Error fetching related news:", err));
  }, [id, propNews]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Article link copied to your clipboard!");
      }
    } catch (error) {
      console.log("Sharing failed or was cancelled.", error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      alert("Please log in to save articles.");
      navigate('/login');
      return;
    }

    setIsBookmarked(!isBookmarked); 

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/bookmark?userId=${user._id}`, 
        { newsId: article._id || id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      login(response.data, token);
    } catch (error) {
      console.error("Failed to bookmark", error);
      setIsBookmarked(isBookmarked); 
    }
  };

  const openArticle = (itemId) => {
    navigate(`/news/${itemId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--text-secondary)' }}>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: '0 0 16px', color: 'var(--text-primary)' }}>Article not found</h2>
        <button onClick={handleBack} style={{ padding: '10px 20px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const formattedDate = article.createdAt || article.date 
    ? new Date(article.createdAt || article.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : 'Recently published';

  return (
    <div className="dn-article-page">
      <style>{`
        .dn-article-page { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); font-family: var(--font-sans); padding-bottom: 80px; transition: background-color 0.3s, color 0.3s; }
        
        .dn-layout-wrapper { max-width: 1180px; margin: 0 auto; padding: 40px 24px; display: grid; grid-template-columns: 1fr 340px; gap: 60px; align-items: start; }
        
        .dn-back-nav { margin-bottom: 40px; }
        .dn-btn-back { display: inline-flex; align-items: center; gap: 8px; background: transparent; border: none; color: var(--text-muted); font-family: inherit; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; padding: 0; transition: color 0.2s ease; }
        .dn-btn-back:hover { color: var(--text-primary); }
        
        .dn-article-header { margin-bottom: 40px; }
        .dn-article-category { display: inline-block; color: var(--accent); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
        .dn-article-title { margin: 0 0 24px; color: var(--text-primary); font-family: var(--font-serif); font-size: clamp(36px, 4vw, 52px); font-weight: 800; line-height: 1.15; letter-spacing: -1px; }
        
        .dn-article-meta { display: flex; align-items: center; justify-content: space-between; border-top: var(--border-thin); border-bottom: var(--border-thin); padding: 16px 0; margin-bottom: 40px; }
        .dn-author-block { display: flex; align-items: center; gap: 12px; }
        .dn-author-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--text-primary); color: var(--bg-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; font-family: var(--font-serif); }
        .dn-author-details { display: flex; flex-direction: column; }
        .dn-author-name { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; }
        .dn-article-date { font-size: 13px; color: var(--text-muted); margin: 0; }
        
        .dn-share-buttons { display: flex; gap: 16px; color: var(--text-muted); font-size: 20px; user-select: none; }
        .dn-share-buttons span { cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .dn-share-buttons span:hover { color: var(--accent); transform: scale(1.1); }
        .bookmarked-icon { color: var(--accent) !important; }

        .dn-article-hero { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 4px; margin-bottom: 40px; background: var(--bg-tertiary); }
        
        .dn-article-body { font-family: var(--font-body); font-size: 19px; line-height: 1.8; color: var(--text-secondary); }
        .dn-article-body a { color: var(--accent); text-decoration: underline; font-weight: 600; }
        .dn-article-body a:hover { color: var(--text-primary); }
        .dn-article-body p:first-of-type::first-letter { font-family: var(--font-serif); font-size: 80px; font-weight: 800; float: left; line-height: 60px; padding-top: 8px; padding-right: 12px; padding-bottom: 8px; color: var(--text-primary); }
        
        .dn-sidebar { position: sticky; top: 100px; border-left: var(--border-thin); padding-left: 40px; }
        .dn-sidebar-title { font-family: var(--font-serif); font-size: 20px; color: var(--text-primary); margin: 0 0 24px; padding-bottom: 12px; border-bottom: var(--border-thick); display: inline-block; }
        
        .dn-side-card { display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; cursor: pointer; }
        .dn-side-category { color: var(--accent); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .dn-side-heading { font-family: var(--font-serif); font-size: 18px; color: var(--text-primary); margin: 0; line-height: 1.3; transition: color 0.2s; }
        .dn-side-card:hover .dn-side-heading { color: var(--accent); }
        .dn-side-meta { font-size: 12px; color: var(--text-muted); }
        
        @media (max-width: 1024px) {
          .dn-layout-wrapper { grid-template-columns: 1fr 280px; gap: 40px; }
          .dn-sidebar { padding-left: 30px; }
        }
        @media (max-width: 850px) {
          .dn-layout-wrapper { grid-template-columns: 1fr; }
          .dn-sidebar { position: static; border-left: none; padding-left: 0; border-top: var(--border-thin); padding-top: 40px; margin-top: 20px; }
          .dn-sidebar-title { display: block; }
        }
        @media (max-width: 700px) {
          .dn-layout-wrapper { padding: 24px 20px; }
          .dn-article-title { font-size: 32px; }
          .dn-article-meta { flex-direction: column; align-items: flex-start; gap: 16px; }
          .dn-article-body { font-size: 17px; line-height: 1.7; }
        }
      `}</style>

      <div className="dn-layout-wrapper">
        <article className="dn-main-content">
          
          <nav className="dn-back-nav">
            <button onClick={handleBack} className="dn-btn-back">
              ← Back to News
            </button>
          </nav>

          <header className="dn-article-header">
            <span className="dn-article-category">{article.category}</span>
            <h1 className="dn-article-title">{article.title}</h1>
            
            <div className="dn-article-meta">
              <div className="dn-author-block">
                <div className="dn-author-avatar">
                  {article.author ? article.author.charAt(0).toUpperCase() : 'D'}
                </div>
                <div className="dn-author-details">
                  <span className="dn-author-name">{article.author || 'DailyNews Desk'}</span>
                  <span className="dn-article-date">{formattedDate} · 4 min read</span>
                </div>
              </div>
              
              <div className="dn-share-buttons">
                <span title="Share Article" onClick={handleShare}>⎋</span>
                <span 
                  title={isBookmarked ? "Remove Bookmark" : "Save Article"} 
                  onClick={handleBookmark}
                  className={isBookmarked ? 'bookmarked-icon' : ''}
                >
                  {isBookmarked ? '📘' : '🔖'}
                </span>
              </div>
            </div>
          </header>

          {article.image && (
            <img 
              src={article.image} 
              alt={article.title} 
              className="dn-article-hero"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}

          <div className="dn-article-body">
            
            {article.contentBlocks && article.contentBlocks.length > 0 ? (
              
              article.contentBlocks.map((block, index) => {
                if (block.blockType === 'paragraph') {
                  return (
                    <p 
                      key={index} 
                      style={{ whiteSpace: 'pre-wrap', marginBottom: '28px' }} 
                      dangerouslySetInnerHTML={{ __html: block.value }} 
                    />
                  );
                }
                
                if (block.blockType === 'image') {
                  return (
                    <div key={index} style={{ margin: '30px 0' }}>
                      <img 
                        src={block.value} 
                        alt="Article content visual" 
                        style={{ width: '100%', borderRadius: '4px', display: 'block', background: 'var(--bg-tertiary)' }} 
                      />
                    </div>
                  );
                }

                if (block.blockType === 'video') {
                  let videoUrl = block.value;

                  // Renders directly uploaded video file from Mac
                  if (videoUrl.startsWith('data:video')) {
                    return (
                      <div key={index} style={{ margin: '30px 0', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                        <video src={videoUrl} controls style={{ width: '100%', display: 'block' }} />
                      </div>
                    );
                  }

                  // Standard YouTube Video Conversion
                  if (videoUrl.includes('watch?v=')) videoUrl = videoUrl.replace('watch?v=', 'embed/');
                  if (videoUrl.includes('youtu.be/')) videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');

                  return (
                    <div key={index} style={{ position: 'relative', paddingBottom: '56.25%', height: 0, margin: '30px 0', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                      <iframe 
                        src={videoUrl} 
                        title="Article Video"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                        allowFullScreen
                      />
                    </div>
                  );
                }

                if (block.blockType === 'link') {
                  let safeLinkUrl = block.value;
                  if (!safeLinkUrl.startsWith('http')) safeLinkUrl = 'https://' + safeLinkUrl;

                  return (
                    <div key={index} style={{ margin: '20px 0', padding: '16px', background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--accent)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Reference: </strong> 
                      <a href={safeLinkUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>{safeLinkUrl}</a>
                    </div>
                  );
                }
                return null;
              })

            ) : (
              article.description?.split('\n').map((paragraph, index) => (
                paragraph.trim() !== '' ? (
                  <p 
                    key={index} 
                    style={{ whiteSpace: 'pre-wrap', marginBottom: '28px' }} 
                    dangerouslySetInnerHTML={{ __html: paragraph }} 
                  />
                ) : null
              ))
            )}

          </div>

        </article>

        <aside className="dn-sidebar">
          <h3 className="dn-sidebar-title">More Top Stories</h3>
          
          {relatedNews.length > 0 ? (
            relatedNews.map((item) => (
              <div 
                key={item._id || item.id} 
                className="dn-side-card"
                onClick={() => openArticle(item._id || item.id)}
              >
                <span className="dn-side-category">{item.category}</span>
                <h4 className="dn-side-heading">{item.title}</h4>
                <span className="dn-side-meta">By {item.author || 'DailyNews Desk'}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No other stories available right now.</p>
          )}
        </aside>

      </div>
    </div>
  );
};

export default NewsDetails;