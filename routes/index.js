var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const User = require('../models/User');

// Middleware for parsing request bodies
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Signup Route - GET
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup Page' });
});

// Signup Route - POST
router.post('/signup', async function(req, res, next) {
  const data = req.body;         // get data from frontend
  if (data['password'] === data['cpassword']) {
    const hashedPassword = await bcrypt.hash(data.password, 10); // Hash password
    const user = {
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword, // Save hashed password
    };
    console.log(user);
    try {
      await User.create(user);
      console.log('User Saved Successfully');
      res.render('login', { msg: 'Signup Successful!' });
    } catch (err) {
      console.error('Error saving user:', err);
      res.render('signup', { msg: 'Signup failed! Email or username might already exist.' });
    }
  } else {
    res.render('signup', { msg: 'Password and confirm password do not match!' });
  }
});

// Login Route - GET
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login Page', msg: null }); // Pass a default value for `msg`
});

router.post('/login', async function (req, res, next) {
  const uname = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: uname } }); // Assuming Sequelize ORM
    if (!user) {
      return res.render('login', { title: 'Login Page', msg: 'Invalid username or password!' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.render('login', { title: 'Login Page', msg: 'Invalid username or password!' });
    }

    console.log('User logged in:', user);
    res.redirect('/home'); // Redirecting to the home page
  } catch (err) {
    console.error('Error during login:', err);
    res.render('login', { title: 'Login Page', msg: 'Login failed due to an error. Please try again later.' });
  }
});


module.exports = router;
