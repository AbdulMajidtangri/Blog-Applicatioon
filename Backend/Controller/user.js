const usermodal = require('../modal/user');
const admin = "admin098@gmail.com";
const password  = "1234567" 
const bcrypt = require('bcrypt');
const Generatetoken = require('../Services/service');
const blogmodal = require('../modal/blog');
const showuser = async (req,res)=>{
  try {
    const user  = await usermodal.find();
    const blog = await blogmodal.find({acceptance : true});
    return res.send({user , blog});
  } catch (error) {
    return res.status(500).send({message : "Error in fetching user" , error : error.message});
  }
};
const handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received signup data:", req.body);

  try {
    const finduser = await usermodal.findOne({ email });
    if (finduser) {
      return res.status(400).send({ message: 'User already exists' });
    }
    if (password.length < 6) {
      return res.status(400).send({ message: 'Password must be at least 6 characters long' });
    }
    const loweremail = email.toLowerCase();
    let role = 'user';
    if (loweremail === admin) {
      if (password !== '1234567') {
        return res.status(400).send({ message: 'Invalid admin password' });
      }
      role = 'admin';
    }
    const newUser = await usermodal.create({ name, email: loweremail, password, role });
    res.status(200).send({ message: 'User successfully signed up', role });
  } catch (error) {
    res.status(500).send({ message: 'Error saving user', error: error.message });
  }
};
const handleUserSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    const loweremail = email.toLowerCase();
    const finduser = await usermodal.findOne({ email: loweremail });
    if (!finduser) {
      return res.status(400).send({ message: 'User not found' });
    }

          if (loweremail === admin) {
      if (password !== '1234567') {
        return res.status(400).send({ message: 'Invalid admin credentials' });
      }
    } else {
               const isMatch = await bcrypt.compare(password, finduser.password);
      if (!isMatch) {
        return res.status(400).send({ message: 'Invalid credentials' });
      }
    }

    const token = Generatetoken(finduser);
    if (!token) {
      return res.status(500).send({ message: 'Token generation failed' });
    }
    
    // Save token to user's tokens array
    finduser.tokens = finduser.tokens.concat({ token });
    await finduser.save();
    
    res.status(200).send({ 
      message: 'User signed in successfully', 
      token, 
      role: finduser.role,
      name: finduser.name 
    });
  } catch (error) {
    res.status(500).send({ message: 'Error signing in', error: error.message });
  }
};

const handledelteuser =  async (req, res) => {
  try {
    await usermodal.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting user', error: error.message });
  }
};
const showuserEditpage =  async (req, res) => {
  try {
    const user = await usermodal.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ message: 'Error fetching user', error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedUser = await usermodal.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).send({ message: 'Error updating user', error: error.message });
  }
}

const logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ message: 'No token provided' });
    }

    const user = await usermodal.findOne({ 'tokens.token': token });
    if (!user) {
      return res.status(401).send({ message: 'Invalid token' });
    }

    // Remove the token from user's tokens array
    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();

    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error logging out', error: error.message });
  }
};

module.exports = { 
  showuser, 
  handleUserSignup, 
  handleUserSignIn, 
  handledelteuser, 
  showuserEditpage, 
  updateUser,
  logout 
};