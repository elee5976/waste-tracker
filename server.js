const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'templates')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());

// Define a route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

// Define a route for handling login form submission
app.post('/login', (req, res) => {
    // Handle login form submission
    const username = req.body.username;
    const password = req.body.password;

    // Add your authentication logic here
    // Check the username and password against your database

    if (authenticated) {
        // Replace with your authentication logic
        req.session.user_id = user_id; // Store user ID in the session
        req.flash('success', 'Login successful.');
        res.redirect('/profile');
    } else {
        req.flash('error', 'Invalid username or password.');
        res.redirect('/login');
    }
});

// Define a route for the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'register.html'));
});

// Define a route for handling registration form submission
app.post('/register', (req, res) => {
    // Handle registration form submission
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Add your registration logic here
    // Create a new user record in your database

    req.flash('success', 'Registration successful. You can now login.');
    res.redirect('/login');
});

app.get('/waste-tracker', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'waste.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
