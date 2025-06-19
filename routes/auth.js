const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('../models/User');

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


// Session Middleware
router.use(session({
  secret: 'secretkey123', // Change this to a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change to true if using HTTPS
}));

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Home Page
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// Signup Page - GET
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Signup Page' });
});

// Signup Page - POST
router.post('/signup', async (req, res) => {
  const { username, email, password, cpassword } = req.body;

  if (password !== cpassword) {
    return res.render('signup', { msg: 'Passwords do not match!' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name: username, email, password: hashedPassword });

    console.log('User registered successfully');
    res.redirect('/login'); // Redirect to login after successful signup
  } catch (err) {
    console.error('Error saving user:', err);
    res.render('signup', { msg: 'Signup failed! Email might already exist.' });
  }
});

// Login Page - GET
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login Page', msg: null });
});

// Login Page - POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { msg: 'Invalid email or password!' });
    }

    req.session.user = user; // Save user in session
    console.log('User logged in:', user.name);
    res.redirect('/home'); // Redirect to home page
  } catch (err) {
    console.error('Error during login:', err);
    res.render('login', { msg: 'Login failed. Please try again.' });
  }
});

// Home Page - Protected Route
router.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { title: 'Home Page', user: req.session.user });
});

router.get('/tryon', isAuthenticated, (req, res) => {
  res.render('tryon', { title: 'Virtual Try on'});
});

// Logout Route
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
