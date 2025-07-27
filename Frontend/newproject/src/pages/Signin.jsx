import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mycontext from '../Context/mycontext';
const Signin = () => {
    const navigate = useNavigate();
    const { login } = useContext(mycontext);
  const [userdata, setUserdata] = useState({
    email: '',
    password: '',
  });
  const [alert, setalert] = useState("");
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'
  const handleChange = (e) => {
    setUserdata({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signin', userdata);
      // Use the login function from context
      login({
        name: response.data.name,
        email: userdata.email,
        role: response.data.role || 'user',
      }, response.data.token);
      
      setUserdata({ email: '', password: '' });
      setalert("Signin successful!");
      setAlertType("success");
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setalert("Error: " + errorMessage);
      setAlertType("error");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <h2>User Signin</h2>
      {alert && (
        <div style={{
          color: alertType === 'success' ? 'green' : 'red',
          marginBottom: 12,
          border: `1px solid ${alertType === 'success' ? 'green' : 'red'}`,
          padding: 8,
          borderRadius: 4,
          background: alertType === 'success' ? '#e6ffe6' : '#ffe6e6',
        }}>{alert}</div>
      )}
      <form onSubmit={handlesubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userdata.email}
            placeholder='Enter Email'
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={userdata.password}
            placeholder='Enter Password'
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }} >Signin</button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
};
export default Signin;