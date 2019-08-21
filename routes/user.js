'use strict'

//require modules and packages
const express = require('express')
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const db = require('../db/');
const User = db.models.User;

//Additional email validation with RegEx
const emailValidator = async (req, res, next) => {
  const emailRegX = /\b[\w.!#$%&’*+\/=?^\`{|}~-]+@[\w-]+(?:\.[\w-]+)*\b/; //RegEx written by Johnny Fox from https://medium.com/factory-mind/regex-cookbook-most-wanted-regex-aa721558c3c1
  const user = req.body;
  if(emailRegX.test(user.emailAddress)){
    next();
  } else {
    res.status(400).json({error: 'Please Check your Email Address!'});
  }
};

//authenticate user method built with the basic-auth package
const authenticateUser = async (req, res, next) => {
  // initials an error message variable set to null
    let message = null;
    //pass the req object through the auth method and await a return to the async promise
    try{
    const credentials = await auth(req);
    //test the results of the auth method
    if (credentials) {
      //find the user associated with the email address
      const user = await User.findOne({where:{
        emailAddress: credentials.name}});
        //if a user is returned, use bcryot to sync and compare passwords
      if (user) {
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
          //if passwords match, alert to authentication success
        if (authenticated) {
          console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
          req.currentUser = user;
        } else {
          message = `Authentication failure for user: ${user.firstName} ${user.lastName}`;
        }
      } else {
        message = `User not found under this email address: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
    // test if there is a new value stored in message variable.
    if (message) {
      console.log(message);
      // Return a response with a 401 Unauthorized HTTP status code.
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
  }catch(error){
    res.status(400).json(error).end();
  }};

//GET request to return the currently logged in user
router.get('/', authenticateUser, async(req, res)=>{
  try{
  //store req.Current user into user variable
  const user = req.currentUser;
  // find a user model in the database that matches the credentials of the current username
  const userModel = await User.findOne({
    where:{
      id: user.id},
    attributes:{
      exclude:['password', 'createdAt', 'updatedAt']
    }}).then((userModel)=>{
      res.json(userModel).status(200).end();
    });
}catch(error){
  res.status(400).json(error);
}});


//POST request to create a new user
router.post('/', emailValidator, async(req, res)=>{
  const user = req.body;
  try{
    const checkUser = await User.findOne({
      where:{
        emailAddress: user.emailAddress
      }
    });

  }catch(error){
    res.status(400).json(error);
  };
  try{
  //hashes password before it is store in the database
  user.password = await bcryptjs.hashSync(user.password);
  //calls upon the user model and passes the body on the request object to the create() method
  const newUser = await User.create(user).then(()=>{
   res.status(201).location(`api/users/`).end();
 });
}catch(error){
  res.status(400).json({errors: error.errors[0].message});
}
});

//exports router file
module.exports = router;
