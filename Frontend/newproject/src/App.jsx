import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import { useEffect, useContext } from 'react';
import mycontext from './Context/mycontext';
import SignUp from './pages/SignUp';
import Signin from './pages/Signin';
import Useredit from './pages/Useredit';
import Navbar from './Components/Navbar'; 
import Addblog from './pages/Addblog';
import Recentblog from './pages/Recentblog';
import BlogDetail from './pages/BlogDetail';


const App = () => {
  const { login } = useContext(mycontext);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    if (token && name && email) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email }));
      // Remove token and user info from URL
      window.history.replaceState({}, document.title, '/');
      window.location.reload();
    }
  }, []);
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/useredit/:id" element={<Useredit />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/signin" element={<Signin />} /> 
        <Route path="/blog/addblog" element={<Addblog />} />
        <Route path="/blog/Recentblog" element={<Recentblog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;