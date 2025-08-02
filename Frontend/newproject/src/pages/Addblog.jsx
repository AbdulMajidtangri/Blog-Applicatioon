import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mycontext from '../Context/mycontext';

const Addblog = () => {
  const [blogdata, setBlogdata] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, isAuthenticated, showToast } = useContext(mycontext);
  
const handlechange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setBlogdata({
        ...blogdata,
        [e.target.name]: e.target.value,
      });
}
  };
  
const handlesubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      showToast("Please sign in to add a blog", "warning");
      navigate('/signin');
      return;
    }
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', blogdata.title);
      formData.append('content', blogdata.content);
      formData.append('author', blogdata.author);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/addblog`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      showToast(response.data.message, "success");
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        showToast("Please sign in to add a blog", "warning");
        navigate('/signin');
      } else {
        showToast("Error adding blog. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      {/* Header Section */}
      <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-4xl)',
          fontWeight: '700',
          color: 'var(--gray-900)',
          marginBottom: 'var(--space-4)',
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ✍️ Share Your Story
        </h1>
        <p style={{ 
          fontSize: 'var(--font-size-lg)',
          color: 'var(--gray-600)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Inspire others with your thoughts, experiences, and insights
        </p>
      </div>

      {/* Authentication Check */}
      {!isAuthenticated() && (
        <div className="alert alert-warning text-center" style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}></div>
          <h3 style={{ color: 'var(--gray-700)', marginBottom: 'var(--space-2)' }}>
            Sign in required
          </h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-4)' }}>
            Please sign in to share your amazing story with our community
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <a href="/signin" className="btn btn-primary">Sign In</a>
            <a href="/signup" className="btn btn-outline">Join Us</a>
          </div>
        </div>
      )}

      {/* Blog Form */}
      <div className="container-md">
        <div className="card animate-fade-in">
          <div className="card-header">
            <h2 style={{ 
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '600',
              color: 'var(--gray-900)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              Create New Blog
            </h2>
          </div>
          
          <div className="card-body">
            <form onSubmit={handlesubmit}>
              {/* Image Upload Section */}
              <div className="form-group">
                <label className="form-label">
                  Featured Image (Optional)
                </label>
                <div style={{
                  border: '2px dashed var(--gray-300)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-8)',
                  textAlign: 'center',
                  transition: 'all var(--transition-normal)',
                  backgroundColor: 'var(--gray-50)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.backgroundColor = 'var(--gray-100)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--gray-300)';
                  e.target.style.backgroundColor = 'var(--gray-50)';
                }}
                >
                  {imagePreview ? (
                    <div>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: 'var(--radius-lg)',
                          marginBottom: 'var(--space-4)'
                        }}
                      />
                      <p style={{ color: 'var(--success)', fontWeight: '500' }}>
                        Image selected successfully!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📷</div>
                      <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-2)' }}>
                        Click to upload or drag and drop
                      </p>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    onChange={handlechange} 
                    name="image" 
                    accept="image/*"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              {/* Title Input */}
              <div className="form-group">
                <label className="form-label">
                  Blog Title
                </label>
                <input 
                  type="text" 
                  value={blogdata.title} 
                  onChange={handlechange} 
                  name="title" 
                  required
                  className="form-input"
                  placeholder="Enter an engaging title for your blog..."
                  style={{ fontSize: 'var(--font-size-lg)' }}
                />
              </div>

              {/* Content Input */}
              <div className="form-group">
                <label className="form-label">
                  Blog Content
                </label>
                <textarea 
                  value={blogdata.content} 
                  onChange={handlechange} 
                  name="content" 
                  required
                  className="form-input form-textarea"
                  placeholder="Share your story, insights, or experiences here..."
                  style={{ 
                    minHeight: '200px',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: '1.6'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'var(--space-2)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--gray-500)'
                }}>
                  <span>Share your thoughts and experiences</span>
                  <span>{blogdata.content.length} characters</span>
                </div>
              </div>

              {/* Author Input */}
              <div className="form-group">
                <label className="form-label">
                  Author Name
                </label>
                <input 
                  type="text" 
                  value={blogdata.author} 
                  onChange={handlechange} 
                  name="author" 
                  required
                  className="form-input"
                  placeholder="Your name or pen name..."
                />
              </div>

              {/* Submit Button */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                justifyContent: 'center',
                marginTop: 'var(--space-8)'
              }}>
                <button 
                  type="button" 
                  onClick={() => navigate('/')}
                  className="btn btn-outline"
                  style={{ minWidth: '120px' }}
                >
                  ← Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!isAuthenticated() || loading}
                  className="btn btn-primary"
                  style={{ 
                    minWidth: '120px',
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <>
                      <div className="loading" style={{ width: '16px', height: '16px' }}></div>
                      Publishing...
                    </>
                  ) : (
                    'Publish Blog'
                  )}
                </button>
              </div>
</form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="card" style={{ marginTop: 'var(--space-8)' }}>
          <div className="card-header">
            <h3 style={{ 
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              color: 'var(--gray-900)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              Writing Tips
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 grid-cols-2" style={{ gap: 'var(--space-4)' }}>
              <div>
                <h4 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '600',
                  color: 'var(--primary-color)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Engaging Title
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                  Create a compelling title that captures attention and clearly describes your content.
                </p>
              </div>
              <div>
                <h4 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '600',
                  color: 'var(--secondary-color)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Rich Content
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                  Share your unique perspective, experiences, or insights that others can learn from.
                </p>
              </div>
              <div>
                <h4 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '600',
                  color: 'var(--warning)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Visual Appeal
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                  Add a relevant image to make your blog more visually appealing and engaging.
                </p>
              </div>
              <div>
                <h4 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '600',
                  color: 'var(--info)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Be Patient
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                  Your blog will be reviewed by our team before being published to ensure quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addblog;