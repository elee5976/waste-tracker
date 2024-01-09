// Set up an Express.js server, configure it to serve static files, and enable middleware for parsing form data, 
// managing user sessions, and handling flash messages
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

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