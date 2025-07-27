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
const appName = process.env.MONGO_APPNAME;
const url = `mongodb+srv://${username}:${password}@${cluster}/${db}?retryWrites=true&w=majority&appName=${appName}`;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

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