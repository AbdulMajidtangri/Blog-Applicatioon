import React, { useEffect, useContext, useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mycontext from '../Context/mycontext';

const Home = () => {
  const { user, showToast } = useContext(mycontext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAcceptedBlogs();
  }, [user]);

  const fetchAcceptedBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/acceptedblogs`);
      setBlogs(response.data.blogs);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleLike = async (blog, e) => {
    e.stopPropagation();
    if (!user) {
      showToast('You must be signed in to like a blog.', 'error');
      return;
    }
    const likedKey = `liked_${user._id}_${blog._id}`;
    const alreadyLiked = localStorage.getItem(likedKey);
    try {
      let response;
      if (!alreadyLiked) {
        response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blog/like/${blog._id}`);
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) =>
            b._id === blog._id ? { ...b, likes: response.data.likes } : b
          )
        );
        localStorage.setItem(likedKey, 'true');
      } else {
        response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blog/like/${blog._id}?unlike=true`);
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) =>
            b._id === blog._id ? { ...b, likes: Math.max(0, (b.likes || 0) - 1) } : b
          )
        );
        localStorage.removeItem(likedKey);
      }
    } catch {
      showToast('Error liking blog', 'error');
    }
  };

  const handleBookmark = async (blog, e) => {
    e.stopPropagation();
    if (!user) {
      showToast('You must be signed in to bookmark a blog.', 'error');
      return;
    }
    const bookmarkKey = `bookmark_${user._id}_${blog._id}`;
    const isBookmarked = localStorage.getItem(bookmarkKey);
    try {
      if (!isBookmarked) {
        localStorage.setItem(bookmarkKey, 'true');
        showToast('Blog bookmarked!', 'success');
      } else {
        localStorage.removeItem(bookmarkKey);
        showToast('Blog removed from bookmarks', 'info');
      }
    } catch {
      showToast('Error bookmarking blog', 'error');
    }
  };

  const handleShare = async (blog, e) => {
    e.stopPropagation();
    
    const shareData = {
      title: blog.title,
      text: blog.content.substring(0, 100) + '...',
      url: `${window.location.origin}/blog/${blog._id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Blog link copied to clipboard!', 'success');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Blog link copied to clipboard!', 'success');
      } catch {
        showToast('Unable to share. Please copy the URL manually.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) 0' }}>
        <div className="text-center">
          <div className="loading" style={{ 
            margin: '0 auto var(--space-6)',
            width: '50px',
            height: '50px',
            border: '5px solid var(--primary-light)',
            borderTop: '5px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ 
            color: 'var(--gray-600)',
            fontSize: '1.25rem',
            fontWeight: '500'
          }}>Loading amazing content...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ 
      padding: 'var(--space-8) 0',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Hero Section - Using gradient and contrast for attention */}
      <div className="text-center" style={{ 
        marginBottom: 'var(--space-16)',
        padding: 'var(--space-12) var(--space-6)',
        background: 'linear-gradient(135deg, rgba(238,247,255,1) 0%, rgba(222,239,255,1) 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: 'var(--space-4)',
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2'
        }}>
          Discover & Share<br />Your Stories
        </h1>
        <p style={{ 
          fontSize: '1.125rem',
          color: 'var(--gray-600)',
          maxWidth: '600px',
          margin: '0 auto var(--space-6)',
          lineHeight: '1.6'
        }}>
          Join our community of passionate writers and readers. Find inspiration or share your own journey.
        </p>
        {user ? (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/blog/addblog')}
            style={{ 
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            Start Writing Now
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '12px 24px',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Join Free
            </button>
            <button 
              onClick={() => navigate('/signin')}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
      
      {/* Blog Section - Using card layout with visual hierarchy */}
      <section style={{ marginBottom: 'var(--space-16)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-8)'
        }}>
          <h2 style={{ 
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--gray-900)',
            position: 'relative',
            display: 'inline-block'
          }}>
            <span style={{
              position: 'absolute',
              bottom: '-4px',
              left: '0',
              width: '60px',
              height: '4px',
              background: 'var(--primary-color)',
              borderRadius: '2px'
            }}></span>
            Trending Stories
          </h2>
          {user && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/blog/addblog')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '10px 20px',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Post
            </button>
          )}
        </div>

        {blogs.length > 0 ? (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {blogs.map(blog => (
              <div 
                key={blog._id} 
                className="card animate-fade-in"
                onClick={() => handleBlogClick(blog._id)}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: '12px',
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                }}
              >
                {blog.image && (
                  <div style={{ 
                    height: '180px', 
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img 
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${blog.image}`} 
                      alt={blog.title}
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: 'var(--success)',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--success)" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Published
                    </div>
                  </div>
                )}
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--gray-900)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {blog.title}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--gray-600)',
                    fontSize: '0.875rem',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {blog.content}
                  </p>
                  
                  {/* Author and Date */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {blog.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'var(--gray-700)',
                          fontWeight: '600'
                        }}>
                          {blog.author}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--gray-500)'
                        }}>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.875rem',
                        color: 'var(--gray-600)'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {Math.ceil(blog.content.length / 1000)} min read
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <button
                        onClick={(e) => handleLike(blog, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '20px',
                          background: user && localStorage.getItem(`liked_${user._id}_${blog._id}`) 
                            ? 'rgba(239, 68, 68, 0.1)' 
                            : 'rgba(0,0,0,0.05)',
                          color: user && localStorage.getItem(`liked_${user._id}_${blog._id}`) 
                            ? 'var(--error)' 
                            : 'var(--gray-700)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = user && localStorage.getItem(`liked_${user._id}_${blog._id}`) 
                            ? 'rgba(239, 68, 68, 0.2)' 
                            : 'rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = user && localStorage.getItem(`liked_${user._id}_${blog._id}`) 
                            ? 'rgba(239, 68, 68, 0.1)' 
                            : 'rgba(0,0,0,0.05)';
                        }}
                      >
                        {user && localStorage.getItem(`liked_${user._id}_${blog._id}`) ? (
                          <FavoriteIcon style={{ fontSize: '18px' }} />
                        ) : (
                          <FavoriteBorderIcon style={{ fontSize: '18px' }} />
                        )}
                        <span>{blog.likes || 0}</span>
                      </button>
                      
                      <button
                        onClick={(e) => handleBookmark(blog, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          border: 'none',
                          borderRadius: '50%',
                          background: user && localStorage.getItem(`bookmark_${user._id}_${blog._id}`) 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'rgba(0,0,0,0.05)',
                          color: user && localStorage.getItem(`bookmark_${user._id}_${blog._id}`) 
                            ? 'var(--primary-color)' 
                            : 'var(--gray-700)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = user && localStorage.getItem(`bookmark_${user._id}_${blog._id}`) 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : 'rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = user && localStorage.getItem(`bookmark_${user._id}_${blog._id}`) 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'rgba(0,0,0,0.05)';
                        }}
                      >
                        {user && localStorage.getItem(`bookmark_${user._id}_${blog._id}`) ? (
                          <BookmarkIcon style={{ fontSize: '18px' }} />
                        ) : (
                          <BookmarkBorderIcon style={{ fontSize: '18px' }} />
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => handleShare(blog, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          border: 'none',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.05)',
                          color: 'var(--gray-700)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(0,0,0,0.1)';
                          e.target.style.color = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(0,0,0,0.05)';
                          e.target.style.color = 'var(--gray-700)';
                        }}
                      >
                        <ShareIcon style={{ fontSize: '18px' }} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleBlogClick(blog._id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary-color)',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px 0',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.gap = '8px';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.gap = '4px';
                      }}
                    >
                      Read more
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--primary-color)" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ 
              color: 'var(--gray-700)',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              No stories yet
            </h3>
            <p style={{ 
              color: 'var(--gray-600)',
              fontSize: '1rem',
              marginBottom: '24px',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              Be the first to share your amazing story with our community!
            </p>
            {user ? (
              <button 
                onClick={() => navigate('/blog/addblog')}
                style={{
                  padding: '12px 24px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Write Your First Story
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => navigate('/signup')}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Join Free
                </button>
                <button 
                  onClick={() => navigate('/signin')}
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: 'var(--primary-color)',
                    border: '2px solid var(--primary-color)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;