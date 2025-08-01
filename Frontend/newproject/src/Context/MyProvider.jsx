import { useState, useEffect } from "react";
import MyContext from "./mycontext";

const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [toasts, setToasts] = useState([]);
  const [like,setlike] = useState();
  // Check if user is authenticated on app load
  useEffect(() => {
    // Always sync user and token from localStorage on mount and when storage changes
    function syncUserFromStorage() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      setToken(storedToken || null);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
    syncUserFromStorage();
    window.addEventListener('storage', syncUserFromStorage);
    return () => window.removeEventListener('storage', syncUserFromStorage);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
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
      like,setlike
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
                {toast.type === 'success' ? '✅' :
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
