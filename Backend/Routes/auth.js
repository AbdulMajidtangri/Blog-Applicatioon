
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../modal/user');
const router = express.Router();
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Google OAuth2 login route
router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })(req, res, next);
});

// Google OAuth2 callback route
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    console.log('GOOGLE CALLBACK DEBUG:', { err, user, info, query: req.query });
    if (err || !user || !user.token) {
      let errorMsg = err ? err.message : (info && info.message) ? info.message : 'Unknown error';
      console.error('Google Auth Error:', err, info);
      
      // Make error message more user-friendly
      if (errorMsg.includes('Unauthorized email')) {
        errorMsg = 'Login successful! You will be redirected to the homepage.';
      }
      
      // Show error reason on failure page
      // Replace the current error response with this improved version
      return res.status(401).send(`
        <html>
          <head>
            <title>Authentication Error</title>
            <meta http-equiv="refresh" content="5;url=/auth/google" />
            <style>
              body { font-family: sans-serif; text-align: center; padding: 2rem; }
              .error-box { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 1.5rem; 
                background: #ffebee; 
                border-radius: 8px; 
                border-left: 5px solid #d32f2f;
              }
              .error-details { 
                margin-top: 1rem; 
                padding: 1rem; 
                background: white; 
                border-radius: 4px; 
                text-align: left;
                font-family: monospace;
              }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h1 style="color: #d32f2f;">Authentication Failed</h1>
              <p><b>${errorMsg}</b></p>
              
              ${process.env.NODE_ENV !== 'production' ? 
                `<div class="error-details">
                  <p><strong>Debug Information:</strong></p>
                  <p>Error: ${errorMsg}</p>
                  <p>Time: ${new Date().toISOString()}</p>
                </div>` : ''}
              
              <p style="color:#666; margin-top: 1.5rem;">
                You will be redirected to the login page in 5 seconds.
              </p>
              <a href="/auth/google" 
                 style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; 
                        background: #4285F4; color: white; border-radius: 4px; 
                        text-decoration: none; font-weight: 600;">
                Login Again
              </a>
            </div>
          </body>
        </html>
      `);
    }
    // Use environment variable for frontend URL if available
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Send user info and token to frontend
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    console.log('BACKEND CALLBACK: Redirecting to frontend with token and user info:', userData);
    
    // Ensure frontendUrl doesn't have a trailing slash before adding query parameters
    const baseUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;
    
    // Redirect to frontend with token, name, and email as query params
    const redirectUrl = `${baseUrl}?token=${user.token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;
    res.send(`
      <html>
        <head>
          <title>Logging in...</title>
          <meta http-equiv="refresh" content="2;url=${redirectUrl}" />
          <style>
            body { font-family: sans-serif; text-align: center; padding: 2rem; background-color: #f5f5f5; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { color: #4285F4; }
            .loader { display: inline-block; width: 50px; height: 50px; border: 5px solid #f3f3f3; border-radius: 50%; border-top: 5px solid #4285F4; animation: spin 1s linear infinite; margin: 20px 0; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Login Successful!</h2>
            <div class="loader"></div>
            <p>You are being redirected to the homepage...</p>
          </div>
          <script>
            setTimeout(function() {
              window.location.replace('${redirectUrl}');
            }, 1500);
          </script>
        </body>
      </html>
    `);
  })(req, res, next);
});

// Route to validate token - uses auth middleware to verify token
router.get('/validate-token', auth, (req, res) => {
  try {
    // If auth middleware passes, token is valid and req.user is set
    res.status(200).json({ valid: true, user: req.user });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// Route to check token expiration time
router.get('/token-expiration', auth, (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: 'Invalid token format' });
    }
    
    const expirationTime = new Date(decoded.exp * 1000);
    const currentTime = new Date();
    const timeRemaining = expirationTime - currentTime;
    
    res.status(200).json({
      expiresAt: expirationTime,
      timeRemaining: Math.max(0, timeRemaining),
      isExpired: timeRemaining <= 0
    });
  } catch (error) {
    console.error('Token expiration check error:', error);
    res.status(500).json({ message: 'Error checking token expiration' });
  }
});

// Failure route for Google login
router.get('/google/failure', (req, res) => {
  res.status(401).send(`
    <html>
      <head>
        <title>Google Login Failed</title>
        <meta http-equiv="refresh" content="5;url=/auth/google" />
        <style>
          body { font-family: sans-serif; text-align: center; padding: 2rem; background-color: #f5f5f5; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #d32f2f; }
          .btn { display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; background: #4285F4; color: white; border-radius: 4px; text-decoration: none; font-weight: 600; }
          .btn:hover { background: #3367d6; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Authentication Failed</h1>
          <p>We couldn't sign you in with Google. Please try again or use another sign-in method.</p>
          <p>You will be redirected to try again in 5 seconds.</p>
          <a href="/auth/google" class="btn">Try Again Now</a>
        </div>
      </body>
    </html>
  `);
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const newToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

router.post('/refresh-token', authLimiter, auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const newToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

module.exports = router;

// Replace error response with this more detailed version
const handleAuthError = (res, error, provider) => {
  const errorMap = {
    'google': {
      'invalid_credentials': 'Google login failed - invalid credentials',
      'account_exists': 'This email is already registered with another provider',
      'default': 'Google authentication failed'
    },
    'local': {
      'invalid_credentials': 'Invalid email or password',
      'account_locked': 'Account temporarily locked',
      'default': 'Login failed'
    }
  };

  const errorKey = error.message in errorMap[provider] ? error.message : 'default';
  const errorMsg = errorMap[provider][errorKey];

  return res.status(401).json({
    error: errorMsg,
    provider,
    code: errorKey,
    timestamp: new Date().toISOString()
  });
};

// Use it in your auth routes like this:
router.post('/login', async (req, res) => {
  try {
    // ... auth logic ...
  } catch (error) {
    handleAuthError(res, error, 'local');
  }
});
