const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const usersController = require('../controllers/users');

//Show registration form
router.get('/register', usersController.renderRegisterForm)

//Register User
router.post('/register', usersController.registerUser)

//Show Login Form
router.get('/login', usersController.renderLoginForm)

//Login User
router.post('/login', passport.authenticate('local', {failureFlash:'Incorrect Details', failureRedirect: '/login'}), usersController.loginUser)

//Logout User
router.get('/logout', usersController.logoutUser)

module.exports = router;