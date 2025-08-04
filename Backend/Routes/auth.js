
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../modal/user');
const router = express.Router();

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
      const errorMsg = err ? err.message : (info && info.message) ? info.message : 'Unknown error';
      console.error('Google Auth Error:', err, info);
      // Show error reason on failure page
      return res.status(401).send(`
        <html>
          <head><title>Google Login Failed</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 2rem;">
            <h1 style="color: #d32f2f;">Google authentication failed</h1>
            <p>Reason: <b>${errorMsg}</b></p>
            <p style="color:#d32f2f;">If you see <b>invalid_grant</b> or <b>Bad Request</b>, it means the login link was reused or expired.<br>
            <b>Do not refresh or revisit the Google callback page.</b><br>
            Always start a new login from the app's sign-in page.</p>
            <p>Please try again or use another sign-in method.</p>
            <a href="/auth/google" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; background: #4285F4; color: white; border-radius: 4px; text-decoration: none; font-weight: 600;">Try Again</a>
          </body>
        </html>
      `);
    }
    // Use environment variable for frontend URL if available
const frontendUrl = process.env.FRONTEND_URL;
    // Send user info and token to frontend
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    console.log('BACKEND CALLBACK: Redirecting to frontend with token and user info:', userData);
    // Redirect to frontend with token, name, and email as query params
     // Use the deployed frontend URL from .env
    const redirectUrl = `${frontendUrl}?token=${user.token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;
    res.send(`
      <html>
        <head><title>Logging in...</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 2rem;">
          <h2>Signing you in with Google...</h2>
          <p>Please wait, you will be redirected shortly.</p>
          <script>
            setTimeout(function() {
              window.location.replace('${redirectUrl}');
            }, 500);
          </script>
        </body>
      </html>
    `);
  })(req, res, next);
});

// Failure route for Google login
router.get('/google/failure', (req, res) => {
  res.status(401).send(`
    <html>
      <head><title>Google Login Failed</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 2rem;">
        <h1 style="color: #d32f2f;">Google authentication failed</h1>
        <p>Please try again or use another sign-in method.</p>
        <a href="/auth/google" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; background: #4285F4; color: white; border-radius: 4px; text-decoration: none; font-weight: 600;">Try Again</a>
      </body>
    </html>
  `);
});

module.exports = router;
