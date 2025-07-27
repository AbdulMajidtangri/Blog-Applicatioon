const express = require('express');
const router = express.Router();
const { 
  showuser, 
  handleUserSignup, 
  handleUserSignIn, 
  handledelteuser, 
  showuserEditpage, 
  updateUser,
  logout 
} = require('../Controller/user');

router.get('/', showuser);
router.post('/submitdata', handleUserSignup);
router.post('/signin', handleUserSignIn);
router.delete('/user/:id', handledelteuser);
router.get('/user/:id', showuserEditpage);
router.put('/user/:id', updateUser);
router.post('/logout', logout);

module.exports = router;