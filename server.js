//change
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

const port = process.env.PORT || 3000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'templates'));

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

db.serialize(() => {
    // Create the "users" table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT
    )`);
    // Create the "waste_data" table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS waste_data (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        waste_type TEXT NOT NULL,
        weight REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Define a route for the login page
app.get('/login', (req, res) => {
    res.render('login', { success: req.flash('success'), error: req.flash('error') });
});

// Define a route for handling login form submission
app.post('/login', (req, res) => {
    // Handle login form submission
    const username = req.body.username;
    const password = req.body.password;

    // Check the username and password against the database
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            // Handle database error
            console.error(err);
            req.flash('error', 'An error occurred during login.');
            res.redirect('/login');
        } else if (row) {
            // Authentication successful
            req.session.user_id = row.id; // Store user ID in the session
            req.flash('success', 'Login successful.');
            res.redirect('/waste-tracker');
        } else {
            // Authentication failed
            req.flash('error', 'Invalid username or password.');
            res.redirect('/login');
        }
    });
});

// Define a route for the registration page
app.get('/register', (req, res) => {
    res.render('register', { success: req.flash('success'), error: req.flash('error') });
});

// Define a route for handling registration form submission
app.post('/register', (req, res) => {
    // Handle registration form submission
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Check if the username already exists in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            // Handle database error
            console.error(err);
            req.flash('error', 'An error occurred during registration.');
            res.redirect('/register');
        } else if (row) {
            // Username already exists
            req.flash('error', 'Username already exists. Please choose another username.');
            res.redirect('/register');
        } else {
            // Insert the new user into the database
            db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err) => {
                if (err) {
                    // Handle database error
                    console.error(err);
                    req.flash('error', 'An error occurred during registration.');
                    res.redirect('/register');
                } else {
                    req.flash('success', 'Registration successful. You can now login.');
                    res.redirect('/login');
                }
            });
        }
    });
});

app.get('/logout', (req, res) => {
    // Clear the user session to log them out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Redirect the user to the login page after logging out
        res.redirect('/login');
    });
});

app.get('/waste-tracker', (req, res) => {
    // Check if the user is logged in
    if (!req.session.user_id) {
        req.flash('error', 'Please log in to view waste data.');
        return res.redirect('/login');
    }

    // Retrieve the user's ID from the session
    const userId = req.session.user_id;

    // Query the waste data associated with the user
    const selectWasteDataQuery = `
        SELECT * FROM waste_data
        WHERE user_id = ?
        ORDER BY timestamp DESC
    `;

    db.all(selectWasteDataQuery, [userId], (err, rows) => {
        if (err) {
            req.flash('error', 'Error retrieving waste data.');
            return res.redirect('/waste-tracker.html');
        }

        // Pass the retrieved waste data to your template
        res.render('waste-tracker.ejs', { wasteData: rows });
    });
});

app.post('/waste-tracker', (req, res) => {
    if (!req.session.user_id) {
        req.flash('error', 'Please log in to submit waste data.');
        return res.redirect('/login');
    }

    // Retrieve the user's ID from the session
    const userId = req.session.user_id;

    // Extract and validate waste data from the request
    const wasteType = req.body.wasteType;
    const weight = parseFloat(req.body.weight);

    // Check if the weight is a valid number and greater than 0
    if (isNaN(weight) || weight <= 0) {
        req.flash('error', 'Invalid weight value.');
        return res.redirect('/waste-tracker'); // Redirect back to the waste submission page
    }

    // Insert waste data into the database
    const insertWasteDataQuery = `
        INSERT INTO waste_data (user_id, waste_type, weight)
        VALUES (?, ?, ?)
    `;

    const wasteDataValues = [userId, wasteType, weight];

    db.run(insertWasteDataQuery, wasteDataValues, function (err) {
        if (err) {
            req.flash('error', 'Error storing waste data.');
        } else {
            req.flash('success', 'Waste data recorded successfully.');
        }
        res.redirect('/waste-tracker'); // Redirect back to the waste submission page
    });
});

// Define a route for the recycling guide page
app.get('/recycling-guide', (req, res) => {
    res.render('recycling-guide', { success: req.flash('success'), error: req.flash('error') });
});

// Define a route for the progress timeline page
app.get('/progress-timeline', (req, res) => {
    res.render('progress-timeline', { success: req.flash('success'), error: req.flash('error') });
});

// Define a route for the about us page
app.get('/about-us', (req, res) => {
    res.render('about-us', { success: req.flash('success'), error: req.flash('error') });
});

// Define a route for the settings page
app.get('/settings', (req, res) => {
    res.render('settings', { success: req.flash('success'), error: req.flash('error') });
});

// Define a route for the binny page
app.get('/binny', (req, res) => {
    res.render('binny', { success: req.flash('success'), error: req.flash('error') });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
