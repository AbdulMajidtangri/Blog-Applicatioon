import React, { useContext } from 'react';
import axios from 'axios';
import mycontext from '../Context/mycontext';

const Navbar = () => {
  const { user, logout, token } = useContext(mycontext);
  // Debug: Log user context to help diagnose 'Guest' issue
  console.log('NAVBAR USER CONTEXT:', user);

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      logout();
    }
  };
  
  return (
    <nav className="navbar navbar-expand-lg" style={{
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow-sm)',
      borderBottom: '1px solid var(--gray-200)',
      padding: 'var(--space-4) 0'
    }}>
      <div className="container">
        <a className="navbar-brand" href="/" style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: '700',
          color: 'var(--primary-color)',
          textDecoration: 'none'
        }}>
          BlogsHub
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNavDropdown" 
          aria-controls="navbarNavDropdown" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          style={{
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto" style={{ gap: 'var(--space-2)' }}>
            <li className="nav-item">
              <a className="nav-link" href="/" style={{
                color: 'var(--gray-700)',
                fontWeight: '500',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-normal)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--gray-100)';
                e.target.style.color = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--gray-700)';
              }}
              >
                Home
              </a>
            </li>
            
            <li className="nav-item">
              <a className="nav-link" href="/blog/addblog" style={{
                color: 'var(--gray-700)',
                fontWeight: '500',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-normal)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--gray-100)';
                e.target.style.color = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--gray-700)';
              }}
              >
              Add Blog
              </a>
            </li>
            
            {user && user.role === 'admin' && (
              <li className="nav-item">
                                 <a className="nav-link" href="/blog/Recentblog" style={{
                   fontWeight: '500',
                   padding: 'var(--space-2) var(--space-4)',
                   borderRadius: 'var(--radius-lg)',
                   transition: 'all var(--transition-normal)',
                   textDecoration: 'none',
                   backgroundColor: 'var(--warning)',
                   color: 'var(--white)'
                 }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#d97706';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--warning)';
                }}
                >
                  Admin Review
                </a>
              </li>
            )}
          </ul>
          
          <div className="navbar-nav">
            <div className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{
                  color: 'var(--gray-700)',
                  fontWeight: '600',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--gray-100)',
                  border: '1px solid var(--gray-200)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
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
                  {user ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                {user ? user.name : 'Guest'}
              </a>
              
              <ul className="dropdown-menu" style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-2)',
                minWidth: '200px'
              }}>
                {user ? (
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={handleLogout}
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--error)',
                        fontWeight: '500',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all var(--transition-normal)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <a 
                        className="dropdown-item" 
                        href="/signup"
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          color: 'var(--primary-color)',
                          fontWeight: '500',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          display: 'block',
                          transition: 'all var(--transition-normal)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--gray-100)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        Register
                      </a>
                    </li>
                    <li>
                      <a 
                        className="dropdown-item" 
                        href="/signin"
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          color: 'var(--secondary-color)',
                          fontWeight: '500',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          display: 'block',
                          transition: 'all var(--transition-normal)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--gray-100)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        Sign In
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;