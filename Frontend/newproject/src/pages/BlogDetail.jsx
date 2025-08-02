import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import mycontext from '../Context/mycontext';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likingBlog, setLikingBlog] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useContext(mycontext);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/blog/${id}`);
      setBlog(response.data.blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Blog not found or error loading content');
    } finally {
      setLoading(false);
    }
  };

  // Like/unlike handler with heart color toggle (same as Home)
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('You must be signed in to like a blog.', 'error');
      return;
    }
    const likedKey = `liked_${user._id}_${blog._id}`;
    const alreadyLiked = localStorage.getItem(likedKey);
    try {
      setLikingBlog(true);
      let response;
      if (!alreadyLiked) {
        response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blog/like/${blog._id}`);
        setBlog(prev => ({ ...prev, likes: response.data.likes }));
        localStorage.setItem(likedKey, 'true');
        showToast('Blog liked!', 'success');
      } else {
        response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blog/like/${blog._id}?unlike=true`);
        setBlog(prev => ({ ...prev, likes: Math.max(0, (prev.likes || 0) - 1) }));
        localStorage.removeItem(likedKey);
        showToast('Like removed!', 'info');
      }
    } catch (error) {
      showToast('Error liking blog', 'error');
    } finally {
      setLikingBlog(false);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('You must be signed in to bookmark a blog.', 'error');
      return;
    }
    const bookmarkKey = `bookmark_${user._id}_${blog._id}`;
    const isBookmarked = localStorage.getItem(bookmarkKey);
    if (!isBookmarked) {
      localStorage.setItem(bookmarkKey, 'true');
      showToast('Blog bookmarked!', 'success');
    } else {
      localStorage.removeItem(bookmarkKey);
      showToast('Blog removed from bookmarks', 'info');
    }
  };

  const handleShare = async () => {
    if (!blog) return;

    const shareData = {
      title: blog.title,
      text: blog.content.substring(0, 100) + '...',
      url: window.location.href
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
      <div style={{ 
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ 
            width: '50px',
            height: '50px',
            border: '5px solid rgba(59, 130, 246, 0.1)',
            borderTop: '5px solid var(--primary-color)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ 
            color: 'var(--gray-600)',
            fontSize: '1.25rem',
            fontWeight: '500'
          }}>Loading blog content...</h2>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ 
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            fontSize: '3rem',
            marginBottom: '1rem',
            color: 'var(--error)'
          }}>❌</div>
          <h2 style={{ 
            color: 'var(--error)',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            {error || 'Blog not found'}
          </h2>
          <p style={{ 
            color: 'var(--gray-600)',
            fontSize: '1rem',
            marginBottom: '1.5rem',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            The blog you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <ArrowBackIcon style={{ fontSize: '1rem' }} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate reading time (average reading speed: 200 words per minute)
  const words = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  return (
    <div style={{ 
      padding: '2rem 1rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'white',
            color: 'var(--primary-color)',
            border: '1px solid var(--primary-color)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
        >
          <ArrowBackIcon style={{ fontSize: '1rem' }} />
          Back
        </button>
      </div>

      {/* Blog Content */}
      <article style={{ 
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        marginBottom: '2rem'
      }}>
        {/* Header Section */}
        <header style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--gray-900)',
                marginBottom: '0.5rem',
                lineHeight: '1.3'
              }}>
                {blog.title}
              </h1>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  background: blog.acceptance ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: blog.acceptance ? 'var(--success)' : 'var(--warning)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {blog.acceptance ? 'Published' : 'Pending Review'}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--gray-500)',
                  fontSize: '0.875rem'
                }}>
                  <AccessTimeIcon style={{ fontSize: '1rem' }} />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  flexShrink: '0'
                }}>
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: 'var(--gray-900)',
                    fontSize: '0.875rem'
                  }}>
                    {blog.author}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--gray-600)'
                  }}>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <button
                  onClick={handleLike}
                  disabled={likingBlog}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    borderRadius: '20px',
                    background: 'rgba(0,0,0,0.05)',
                    color: 'var(--gray-700)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                  }}
                >
                  {user && localStorage.getItem(`liked_${user._id}_${blog._id}`) ? (
                    <FavoriteIcon style={{ color: 'red', fontSize: '1rem' }} />
                  ) : (
                    <FavoriteBorderIcon style={{ fontSize: '1rem' }} />
                  )}
                  <span>{blog.likes || 0}</span>
                </button>
                
                <button
                  onClick={handleBookmark}
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
                    e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                  }}
                >
                  {user && localStorage.getItem(`bookmark_${user._id}_${blog._id}`) ? (
                    <BookmarkIcon style={{ color: 'var(--primary-color)', fontSize: '1rem' }} />
                  ) : (
                    <BookmarkBorderIcon style={{ fontSize: '1rem' }} />
                  )}
                </button>
                
                <button
                  onClick={handleShare}
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
                    e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
                    e.currentTarget.style.color = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                    e.currentTarget.style.color = 'var(--gray-700)';
                  }}
                >
                  <ShareIcon style={{ fontSize: '1rem' }} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Image Section */}
        {blog.image && (
          <div style={{
            padding: '0 1.5rem',
            marginBottom: '1.5rem'
          }}>
            <img 
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${blog.image}`} 
              alt={blog.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              loading="lazy"
            />
          </div>
        )}

        {/* Content Section */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <div style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: 'var(--gray-800)',
            whiteSpace: 'pre-wrap'
          }}>
            {blog.content}
          </div>
        </div>
      </article>

      {/* Related Actions */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        {user && (
          <button 
            onClick={() => navigate('/blog/addblog')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <EditIcon style={{ fontSize: '1rem' }} />
            Write Your Own Story
          </button>
        )}
        
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: 'var(--primary-color)',
            border: '1px solid var(--primary-color)',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'white';
          }}
        >
          <ArrowBackIcon style={{ fontSize: '1rem' }} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;