import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mycontext from '../Context/mycontext';
const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useContext(mycontext);
  const [userdata, setUserdata] = useState({
    name: '',
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

  // Trim input values to avoid extra spaces
  const trimmedData = {
    name: userdata.name.trim(),
    email: userdata.email.trim().toLowerCase(),
    password: userdata.password.trim(),
  };

  try {
    const response = await axios.post('http://localhost:5000/submitdata', trimmedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Signup successful:", response.data);

    // Use the login function from context
    login({
      name: trimmedData.name,
      email: trimmedData.email,
      role: response.data.role || 'user',
    }, response.data.token);

    setUserdata({ name: '', email: '', password: '' });
    setalert("Submission Successfully done");
    setAlertType("success");
    navigate('/');
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);

    const errMsg = error.response?.data?.message || "Unexpected error";
    setalert("Error: " + errMsg);
    setAlertType("error");
  }
};


  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <h2>User SignUp</h2>
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
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userdata.name}
            onChange={handleChange}
            placeholder='Enter name'

            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
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
        <button type="submit" style={{ padding: '8px 16px' }} >Singup</button>
       <p> Lorem ipsum, dolor <a href="/signin">signin</a> sit amet consectetur adipisicing elit. Ea consectetur doloribus nobis!
       </p>
      </form>
    </div>
  );
};

export default SignUp;