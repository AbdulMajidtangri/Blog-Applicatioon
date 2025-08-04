const express = require('express');
const app=  express();
const usermodal = require('./modal/user')
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./Routes/user')
const blogroute = require('./Routes/blog')
const path = require('path');
const fs = require('fs');

require('dotenv').config();
const port = process.env.PORT || 5000;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const db = process.env.MONGO_DB;
const cluster = process.env.MONGO_CLUSTER;

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./modal/user');
const authRoute = require('./Routes/auth');
const appName = process.env.MONGO_APPNAME;
const url = `mongodb+srv://${username}:${password}@${cluster}/${db}?retryWrites=true&w=majority&appName=${appName}`;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Passport Google OAuth2 setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value.toLowerCase();
    if (email !== "admin098@gmail.com") {
      return done(new Error('Unauthorized email. Only admin email is allowed.'), null);
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: email,
        role: 'admin'
      });
      await user.save();
    }
    const token = jwt.sign({
      id: user._id,
      name: user.name,
      email: user.email
    }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return done(null, { ...user.toObject(), token });
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});


app.use(session({
  secret: process.env.SECRET_KEY || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/auth', authRoute);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));
app.use(routes)
app.use('/blog', blogroute)

app.listen(port,()=>{
  console.log(`The Server is Runnig Over ${port}`);
})