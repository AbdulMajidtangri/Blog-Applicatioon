import React, { useEffect, useState } from 'react';
import mycontext from '../Context/mycontext';
import { useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Useredit = () => {
  const { users } = useContext(mycontext);
  const [userdata, setUserdata] = useState({ name: '', email: '', password: '' });
  const [alert, setalert] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const user = users.find(u => u._id === id);
    if (user) {
      setUserdata({ name: user.name, email: user.email, password: user.password || '' });
    } else {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`)
        .then(res => {
          setUserdata({
            name: res.data.user.name || '',
            email: res.data.user.email || '',
            password: ''
          });
        })
        .catch(() => setalert('Could not fetch user data.'));
    }
  }, [id, users]);

  const handleChange = (e) => {
    setUserdata({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, { name: userdata.name });
      setalert('User updated successfully');
      navigate('/');
    } catch (error) {
      setalert('There is an error in the site: ' + error.message);
    }
  };

  return (
    <>
      <div>User Edit Page</div>
      <p>This page is for editing user details.</p>
      {alert && <div style={{ color: alert.includes('success') ? 'green' : 'red' }}>{alert}</div>}
      <form onSubmit={handlesubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userdata.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }} >Update User</button>
      </form>
    </>
  );
};

export default Useredit;