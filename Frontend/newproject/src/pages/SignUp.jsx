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
        <div style={{ 
            padding: '40px', 
            maxWidth: '450px', 
            margin: '40px auto',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff'
        }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '24px',
                color: '#333333',
                fontSize: '28px'
            }}>Create Account</h2>
            
            {alert && (
                <div style={{
                    color: alertType === 'success' ? '#155724' : '#721c24',
                    marginBottom: '16px',
                    border: `1px solid ${alertType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                    padding: '12px',
                    borderRadius: '4px',
                    background: alertType === 'success' ? '#d4edda' : '#f8d7da',
                    fontSize: '14px'
                }}>{alert}</div>
            )}
            
            <form onSubmit={handlesubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#555555',
                        fontSize: '14px'
                    }}>Full Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userdata.name}
                        onChange={handleChange}
                        placeholder='Enter your name'
                        required
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #dddddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.3s',
                            outline: 'none'
                        }}
                    />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#555555',
                        fontSize: '14px'
                    }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userdata.email}
                        placeholder='Enter your email'
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #dddddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.3s',
                            outline: 'none'
                        }}
                    />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#555555',
                        fontSize: '14px'
                    }}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={userdata.password}
                        placeholder='Create a password'
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #dddddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.3s',
                            outline: 'none'
                        }}
                    />
                </div>
                
                <button 
                    type="submit" 
                    style={{ 
                        width: '100%',
                        padding: '12px', 
                        backgroundColor: '#1075e8ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        marginBottom: '16px'
                    }}
                >
                    Sign Up
                </button>
                
                <p style={{ 
                    textAlign: 'center', 
                    color: '#666666',
                    fontSize: '14px',
                    marginTop: '20px'
                }}>
                    Already have an account? 
                    <a href="/signin" style={{
                        color: '#1075e8ff',
                        textDecoration: 'none',
                        fontWeight: '500',
                        marginLeft: '4px'
                    }}>Sign in</a>
                </p>
            </form>
        </div>
    );
};

export default SignUp;