const http = require("http");
const url = require("url");
const fs = require("fs");

const port = process.env.PORT || 3000;
const dbFile = "waste_data.json";

// Initialize the waste data as an empty array
let wasteData = [];

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Parse the URL to handle different routes
    const parsedUrl = url.parse(req.url, true);
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});