const express = require('express');
const app=  express();
const usermodal = require('./modal/user')
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./Routes/user')
const blogroute = require('./Routes/blog')
const path = require('path');
const fs = require('fs');
const port = 5000;

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

mongoose.connect('mongodb://localhost:27017/connectingdbs', {
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