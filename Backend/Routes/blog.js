const express = require('express');
const router = express.Router();
const { 
  handleAddBlog, 
  getAllBlogs, 
  getAcceptedBlogs, 
  acceptBlog, 
  rejectBlog,
  getBlogById,
  likeBlog,
} = require('../Controller/blog');
const auth = require('../middleware/auth');

router.post('/addblog', auth, handleAddBlog);
router.get('/allblogs', getAllBlogs);
router.get('/acceptedblogs', getAcceptedBlogs);
router.get('/blog/:id', getBlogById);

// Like blog route
router.put('/like/:id', likeBlog);
router.put('/accept/:id', auth, acceptBlog);
router.delete('/reject/:id', auth, rejectBlog);

module.exports = router;