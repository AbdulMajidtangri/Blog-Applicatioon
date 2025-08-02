import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mycontext from '../Context/mycontext';

const Recentblog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingBlog, setProcessingBlog] = useState(null);
  const navigate = useNavigate();
  const { token, user, showToast } = useContext(mycontext);

    useEffect(() => {
    fetchBlogs();
    }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/allblogs`);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (!token) {
      showToast('Authentication required. Please sign in again.', 'warning');
      return;
    }

    try {
      setProcessingBlog(id);
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/blog/accept/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showToast('Blog accepted successfully!', 'success');
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error accepting blog:', error);
      if (error.response?.status === 401) {
        showToast('Authentication failed. Please sign in again.', 'error');
      } else {
        showToast('Error accepting blog. Please try again.', 'error');
      }
    } finally {
      setProcessingBlog(null);
    }
  };

  const handleReject = async (id) => {
    if (!token) {
      showToast('Authentication required. Please sign in again.', 'warning');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this blog? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessingBlog(id);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/blog/reject/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showToast('Blog rejected successfully!', 'success');
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting blog:', error);
      if (error.response?.status === 401) {
        showToast('Authentication failed. Please sign in again.', 'error');
      } else {
        showToast('Error rejecting blog. Please try again.', 'error');
      }
    } finally {
      setProcessingBlog(null);
    }
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="container" style={{ padding: 'var(--space-16) 0' }}>
        <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}></div>
          <h2 style={{ color: 'var(--error)', marginBottom: 'var(--space-4)' }}>
            Access Denied
          </h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-6)' }}>
            Only administrators can access the blog review panel.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) 0' }}>
        <div className="text-center">
          <div className="loading" style={{ margin: '0 auto var(--space-6)' }}></div>
          <h2 style={{ color: 'var(--gray-600)' }}>Loading blogs for review...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      {/* Header Section */}
      <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-4xl)',
          fontWeight: '700',
          color: 'var(--gray-900)',
          marginBottom: 'var(--space-4)',
          background: 'linear-gradient(135deg, var(--warning), var(--primary-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Admin Review Panel
        </h1>
        <p style={{ 
          fontSize: 'var(--font-size-lg)',
          color: 'var(--gray-600)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Review and moderate submitted blogs to maintain quality standards
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 grid-cols-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📊</div>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--gray-900)', marginBottom: 'var(--space-1)' }}>
            {blogs.length}
          </h3>
          <p style={{ color: 'var(--gray-600)' }}>Total Blogs</p>
        </div>
        <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>⏳</div>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--warning)', marginBottom: 'var(--space-1)' }}>
            {blogs.filter(blog => !blog.acceptance).length}
          </h3>
          <p style={{ color: 'var(--gray-600)' }}>Pending Review</p>
        </div>
        <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}></div>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--success)', marginBottom: 'var(--space-1)' }}>
            {blogs.filter(blog => blog.acceptance).length}
          </h3>
          <p style={{ color: 'var(--gray-600)' }}>Published</p>
        </div>
      </div>

      {/* Blogs Section */}
      <section>
        <h2 style={{ 
          fontSize: 'var(--font-size-3xl)',
          fontWeight: '600',
          color: 'var(--gray-900)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          📝 Blog Submissions
        </h2>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 grid-cols-2" style={{ gap: 'var(--space-6)' }}>
            {blogs.map(blog => (
              <div 
                key={blog._id} 
                className="card animate-fade-in"
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  border: blog.acceptance ? '2px solid var(--success)' : '2px solid var(--warning)',
                  backgroundColor: blog.acceptance ? '#f0fdf4' : '#fffbeb'
                }}
                onClick={() => handleBlogClick(blog._id)}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  backgroundColor: blog.acceptance ? 'var(--success)' : 'var(--warning)',
                  color: 'var(--white)',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: '600',
                  zIndex: 10
                }}>
                  {blog.acceptance ? 'Published' : 'Pending'}
                </div>

                {/* Image Section */}
                {blog.image && (
                  <div style={{ 
                    height: '200px', 
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
                        transition: 'transform var(--transition-slow)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                )}
                
                {/* Content Section */}
                <div className="card-body">
                  <h3 style={{ 
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    color: 'var(--gray-900)',
                    marginBottom: 'var(--space-3)',
                    lineHeight: '1.4'
                  }}>
                    {blog.title}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--gray-600)',
                    fontSize: 'var(--font-size-sm)',
                    marginBottom: 'var(--space-4)',
                    lineHeight: '1.6'
                  }}>
                    {blog.content.length > 120 
                      ? `${blog.content.substring(0, 120)}...` 
                      : blog.content
                    }
                  </p>
                  
                  {/* Author and Date */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--gray-200)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: '600'
                      }}>
                        {blog.author.charAt(0).toUpperCase()}
                      </span>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--gray-700)',
                        fontWeight: '500'
                      }}>
                        {blog.author}
                      </span>
    </div>

                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--gray-500)'
                    }}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Action Buttons for Pending Blogs */}
                  {!blog.acceptance && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        gap: 'var(--space-3)',
                        justifyContent: 'center'
                      }}
                    >
                      <button 
                        onClick={() => handleAccept(blog._id)}
                        disabled={processingBlog === blog._id}
                        className="btn btn-success"
                        style={{ 
                          flex: 1,
                          position: 'relative'
                        }}
                      >
                        {processingBlog === blog._id ? (
                          <>
                            <div className="loading" style={{ width: '16px', height: '16px' }}></div>
                            Accepting...
                          </>
                        ) : (
                          'Accept'
                        )}
                      </button>
                      <button 
                        onClick={() => handleReject(blog._id)}
                        disabled={processingBlog === blog._id}
                        className="btn btn-danger"
                        style={{ 
                          flex: 1,
                          position: 'relative'
                        }}
                      >
                        {processingBlog === blog._id ? (
                          <>
                            <div className="loading" style={{ width: '16px', height: '16px' }}></div>
                            Rejecting...
                          </>
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </div>
                  )}

                  {/* View Full Blog Link */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: 'var(--space-4)',
                    paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--gray-200)'
                  }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--primary-color)',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = 'none';
                    }}
                    >
                      Click to view full blog
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📝</div>
            <h3 style={{ color: 'var(--gray-700)', marginBottom: 'var(--space-4)' }}>
              No blogs to review
            </h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-6)' }}>
              All submitted blogs have been reviewed and processed.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Recentblog;