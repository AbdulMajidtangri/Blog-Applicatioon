import { useState, useEffect } from "react";
import MyContext from "./mycontext";
import axios from 'axios';

const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [toasts, setToasts] = useState([]);
  const [like, setlike] = useState();
  const [tokenValidated, setTokenValidated] = useState(false);
  const [validating, setValidating] = useState(false);
  
  // Check if user is authenticated on app load
  useEffect(() => {
    // Always sync user and token from localStorage on mount and when storage changes
    function syncUserFromStorage() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      setToken(storedToken || null);
      setUser(storedUser ? JSON.parse(storedUser) : null);
      
      // If we have a token, validate it with the server
      if (storedToken) {
        validateToken(storedToken);
      } else {
        setTokenValidated(true); // No token to validate
      }
    }
    
    syncUserFromStorage();
    window.addEventListener('storage', syncUserFromStorage);
    return () => window.removeEventListener('storage', syncUserFromStorage);
  }, []);
  
  // Function to validate token with the server
  const validateToken = async (tokenToValidate) => {
    if (!tokenToValidate || validating) return;
    
    try {
      setValidating(true);
      // Make a request to the dedicated token validation endpoint
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/validate-token`, {
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`
        }
      });
      
      if (response.data.valid) {
        setTokenValidated(true);
        // Update user data if needed
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } else {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      // If token is invalid, clear authentication
      if (error.response?.status === 401) {
        logout();
        showToast('Your session has expired. Please sign in again.', 'warning');
      }
      setTokenValidated(false);
    } finally {
      setValidating(false);
    }
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setTokenValidated(true); // Trust the token is valid on fresh login
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setTokenValidated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user && tokenValidated;
  };

  // Toast notification system
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <MyContext.Provider value={{ 
      user, 
      setUser, 
      token, 
      setToken, 
      login, 
      logout, 
      isAuthenticated,
      showToast,
      removeToast,
      like,
      setlike,
      tokenValidated
    }}>
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: 'var(--space-4) var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--white)',
              fontWeight: '500',
              fontSize: 'var(--font-size-sm)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 
                toast.type === 'success' ? 'var(--success)' :
                toast.type === 'error' ? 'var(--error)' :
                toast.type === 'warning' ? 'var(--warning)' :
                'var(--primary-color)',
              animation: 'slideInRight 0.3s ease-out',
              cursor: 'pointer',
              minWidth: '300px',
              maxWidth: '400px'
            }}
            onClick={() => removeToast(toast.id)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span style={{ fontSize: 'var(--font-size-lg)' }}>
                {toast.type === 'success' ? '' :
                 toast.type === 'error' ? '❌' :
                 toast.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </MyContext.Provider>
  );
};

export default MyProvider;

const refreshToken = async () => {
  try {
    const response = await axios.post('/auth/refresh-token', { token }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
    return true;
  } catch (error) {
    logout();
    addToast('Session expired, please login again');
    return false;
  }
};

// Modify checkTokenExpiration
const checkTokenExpiration = async () => {
  if (token) {
    const decoded = jwt.decode(token);
    const remainingTime = decoded.exp * 1000 - Date.now();
    
    if (remainingTime < 0) {
      logout();
      addToast('Session expired, please login again');
    } else if (remainingTime < 300000) { // 5 minutes before expiry
      await refreshToken();
    }
  }
};

// Add to validateToken function
const validateToken = async () => {
  try {
    const response = await axios.get('/auth/validate-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTokenValidated(true);
  } catch (error) {
    logout();
    addToast('Session expired, please login again');
  }
};

// Call this before any protected action
const ensureAuthenticated = async () => {
  if (!token || !tokenValidated) {
    await validateToken();
  }
  return tokenValidated;
};
