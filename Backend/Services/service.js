const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;
const Generatetoken = (user)=>{
    const token = jwt.sign({
        id : user._id,
        name : user.name,
        email : user.email
    },secret, {
        expiresIn: '1h' // Token valid for 1 hour
    });
    return token;
}
module.exports = Generatetoken;