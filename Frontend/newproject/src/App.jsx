import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import { useEffect, useContext, useState } from 'react';
import mycontext from './Context/mycontext';
import SignUp from './pages/SignUp';
import Signin from './pages/Signin';
import Useredit from './pages/Useredit';
import Navbar from './Components/Navbar'; 
import Addblog from './pages/Addblog';
import Recentblog from './pages/Recentblog';
import BlogDetail from './pages/BlogDetail';
import ErrorBoundary from './Components/ErrorBoundary';


const App = () => {
  const { login, tokenValidated } = useContext(mycontext);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    
    if (token && name && email) {
      // Handle OAuth redirect with token in URL
      const role = params.get('role') || 'user';
      login({ name, email, role }, token);
      
      // Remove token and user info from URL
      window.history.replaceState({}, document.title, '/');
    }
  }, [login]);
  
  // Separate effect to handle loading state based on token validation
  useEffect(() => {
    // Once token validation is complete (whether successful or not), stop loading
    setLoading(false);
  }, [tokenValidated]);
  // Show loading indicator while validating token
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderRadius: '50%',
          borderTop: '5px solid #4285F4',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Loading your session...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <ErrorBoundary>
            <HomePage />
          </ErrorBoundary>
        } />
        <Route path="/useredit/:id" element={
          <ErrorBoundary>
            <Useredit />
          </ErrorBoundary>
        } />
        <Route path="/signup" element={
          <ErrorBoundary>
            <SignUp />
          </ErrorBoundary>
        } />
        <Route path="/signin" element={
          <ErrorBoundary>
            <Signin />
          </ErrorBoundary>
        } />
        <Route path="/blog/addblog" element={
          <ErrorBoundary>
            <Addblog />
          </ErrorBoundary>
        } />
        <Route path="/blog/Recentblog" element={
          <ErrorBoundary>
            <Recentblog />
          </ErrorBoundary>
        } />
        <Route path="/blog/:id" element={
          <ErrorBoundary>
            <BlogDetail />
          </ErrorBoundary>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// Remove any other App component declarations in this file