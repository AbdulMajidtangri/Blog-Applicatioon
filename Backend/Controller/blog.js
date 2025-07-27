const Blog = require('../modal/blog');
const multer = require('multer');
const path = require('path');

// Like or unlike a blog (sequential, never negative)
const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const unlike = req.query.unlike === 'true';
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (unlike) {
      blog.likes = Math.max(0, (blog.likes || 0) - 1);
    } else {
      blog.likes = (blog.likes || 0) + 1;
    }
    await blog.save();
    res.status(200).json({ message: unlike ? 'Blog unliked' : 'Blog liked', likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking blog', error: error.message });
  }
};


// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image');

const handleAddBlog = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, content, author } = req.body;
      const image = req.file ? req.file.filename : null;
      
      const blog = new Blog({ 
        title, 
        content, 
        author, 
        image 
      });
        await blog.save();
      res.status(200).json({ message: "Blog added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error in adding blog", error: error.message });
    }
  });
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

const getAcceptedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ acceptance: true }).sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching accepted blogs", error: error.message });
  }
};

const acceptBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { acceptance: true }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog accepted successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error accepting blog", error: error.message });
  }
};

const rejectBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog rejected and deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting blog", error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};


module.exports = { 
  handleAddBlog, 
  getAllBlogs, 
  getAcceptedBlogs, 
  acceptBlog, 
  rejectBlog,
  getBlogById,
  likeBlog,
};