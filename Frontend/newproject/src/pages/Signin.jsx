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
            }}>User Signin</h2>
            
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
                    }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userdata.email}
                        placeholder='Enter Email'
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
                        placeholder='Enter Password'
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
                        backgroundColor: '#4a90e2',
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
                    Signin
                </button>
                <div style={{ 
                    textAlign: 'center', 
                    margin: '24px 0',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        right: '0',
                        height: '1px',
                        backgroundColor: '#eeeeee',
                        zIndex: '1'
                    }}></div>
                    <span style={{ 
                        display: 'inline-block',
                        position: 'relative',
                        borderRadius: '4px',
                        zIndex: '2',
                        backgroundColor: '#ffffff',
                        padding: '0 16px',
                        color: '#777777',
                        fontSize: '14px'
                    }}>or continue with</span>
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <a
                        href="http://localhost:5000/auth/google"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#1075e8ff',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '14px',
                            width: '100%'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginRight: '8px' }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                    </a>
                </div>
                
                <p style={{ 
                    textAlign: 'center', 
                    color: '#666666',
                    fontSize: '14px'
                }}>
                    Don't have an account? 
                    <a href="/signup" style={{
                        color: '#1075e8ff',
                                                    borderRadius: '4px',

                        textDecoration: 'none',
                        fontWeight: '500',
                        marginLeft: '4px'
                    }}>Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default Signin;