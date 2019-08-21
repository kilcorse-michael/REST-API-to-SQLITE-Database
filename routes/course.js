'use strict'
const express = require('express')
const router = express.Router();
const db = require('../db/');
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const Course = db.models.Course;
const User = db.models.User;


//authenticate user method built with the basic-auth package
const authenticateUser = async(req, res, next) => {
    let message = null;
    try{
    const credentials = await auth(req);
    //test the results of the auth method
    if (credentials) {
      //find the user associated with the email address
      const user = await User.findOne({where:{
        emailAddress: credentials.name}});
        //if a user is returned, use bcrypt to sync and compare passwords
      if (user) {
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
          //if passwords match, alert to authentication success
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.username}`);
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.username}`;
        }
      } else {

        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
    // test if there is a new value stored in message variable.
    if (message) {
      console.warn(message);
      // Return a response with a 401 Unauthorized HTTP status code.
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
  }catch(error){
    res.status(400).json(error).end();
  }};

//returns a list of all courses and associated creators
router.get('/', async(req, res, next)=>{
  try{
  await Course.findAll({
    attributes:{
      exclude: ['userId', 'createdAt', 'updatedAt']},
    include:[{
      model: User,
      as: 'Creator',
      attributes:{
        exclude:['createdAt', 'updatedAt', 'password']
        }
      }
    ]}).then((courses)=>{
    if(courses){
      res.json(courses).status(200).end();
    }else{
      res.status(404).json({error: 'Could not find Courses!'}).end()
    }
  })
}catch(error){
  res.status(400).json(error);
}});

//retrieves information on a specific course and associated user
router.get('/:id',async (req, res, next) => {
  try{
     await Course.findOne({
       where:{
         id: req.params.id
       },
       attributes:{
         exclude: ['userId', 'createdAt', 'updatedAt']},
       include:[{
         model: User,
         as: 'Creator',
         attributes:{
           exclude:['createdAt', 'updatedAt', 'password']
           }
         }
       ]}).then((course) => {
        if(course){
            res.json(course).status(200).end();
        }else{
            res.status(404).json({error: 'no course found!'}).end()
        }
    })
}catch(error){
  res.status(400).json(error).end();
}});

// allows an authenticated user to create a new course using the ORM's built in validators
router.post('/', authenticateUser, async (req, res, next)=>{
  const course = req.body;
  const user = req.currentUser;
  try{
  const newCourse = await Course.create({
    title: course.title,
    description: course.description,
    estimatedTime: course.estimatedTime,
    materialsNeeded: course.materialsNeeded,
    userId: user.id
  }).then((newCourse)=>{
   res.status(201).location(`/api/courses/${newCourse.id}`).end();
 });
}catch(error){
  res.status(400).json({errors: error.errors[0].message}).end();
}
});

//update course information if the authenticated user is the creator of the course
router.put('/:id',authenticateUser, async(req, res, next)=>{
  //204 - Updates a course and returns no content
  const course = req.body;
  const user = req.currentUser;
  try{
  await Course.update({
    title: course.title,
    description: course.description,
    estimatedTime: course.estimatedTime,
    materialsNeeded: course.materialsNeeded,
  }, {where: {id: req.params.id}}).then(async()=>{
    const currentCourse = await Course.findOne({where:{id: req.params.id}});
    if(currentCourse.userId === user.id){
    res.status(204).end();
  }else {
    res.status(403).json({error: "Only the creator of this course can update changes!"}).end();
}});
} catch(error){
  res.status(400).json({errors: error.errors[0].message}).end();
}});

//allows the creator of the course to delete a course they created
router.delete('/:id',authenticateUser, async (req, res, next)=>{
  //204 - Deletes a course and returns no content
  const currentCourse = await Course.findOne({where:{ id: req.params.id}});
  const user = req.currentUser;
  try {
    if(currentCourse.userId === user.id){
      Course.destroy({where:{ id: req.params.id}}).then(()=>{
        res.status(204).end();
      });
    } else{
      res.status(403).json({error: "Only the creator can delete this course!"})
    }
  } catch(error){
    res.status(400).json({error: "course.destroy has failed"}).end();
  }
});



module.exports = router;
