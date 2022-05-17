const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserModel = require('../userDetails.js')
const bcrypt = require('bcrypt');
const connectEnsureLogin = require('connect-ensure-login')
const nodemailer = require('nodemailer');

router.get('/', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('home')
});

router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.get('/loginfailed', (req, res) => {
  res.render('loginfailed.ejs');
});

router.get('/register', (req, res) => {
  res.render('register.ejs')
})

router.post('/register', (req, res) => {
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  const passwordConfirm = req.body.passwordConfirm

  if (password == passwordConfirm) {
    UserModel.find({ email }).lean().exec(function(err, doc) {
      try {
        if (doc[0].email == email) {
          res.render('registerfailed', { message: 'Email in use!' })
        } 
      } catch {
        UserModel.find({ username }).lean().exec(function(err, doc) {
          try {
            if (doc[0].username == username) {
              res.render('registerfailed', { message: 'Username in use!' })
            } 
          } catch {
            Users=new UserModel({email: req.body.email, username : req.body.username});   

            UserModel.register(Users, req.body.password, function(err, user) { 

            if (err) { 

              res.render('registerfailed', {message: err.message}) 

            }else{ 

              res.render('registersuccess', {message: 'Successfully Registered!'})

            } 

          });

          }
        })
      }
    })
  } else {
    res.render('registerfailed', { message: 'Passwords do not match!' })
  }
})

router.get('/settings', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('settings')
})

router.get('/logout', (req, res) => {
  req.logout();
  res.render('loggedout');
});

// POST Routes
router.post('/login', UserModel.doLogin = function(req, res) { 

  if(!req.body.username){ 

    res.json({success: false, message: "No username given!"}) 

  } else { 

    if(!req.body.password){ 

      res.render('loginfailed', {message: 'No password given!'}) 

    }else{ 

      passport.authenticate('local', function (err, user, info) { 

         if(err){ 

          res.render('loginfailed', {message: err}) 

         } else{ 

          if (! user) { 

            res.render('loginfailed', {message: 'Username or password incorrect!'}) 

          } else{ 

            req.login(user, function(err){ 

              if(err){ 

                res.render('loginfailed', {message: err})  

              }else{

                res.redirect('/') 

              } 

            }) 

          } 

         } 

      })(req, res); 

    } 

  } 

}) 


module.exports = router;
