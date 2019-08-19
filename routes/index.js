'use strict'
//require modules and packages
const express = require('express')
const router = express.Router();
const userRoute = require('./user.js');
const courseRoute = require('./course.js')

//set the router use method on the /users and /course path
router.use('/users', userRoute);
router.use('/courses', courseRoute);

//export router
module.exports = router;
