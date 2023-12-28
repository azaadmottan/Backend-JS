// Two different way to include external file. 1. CJS (common js) 2. MJS (module js)

// require('dotenv').config();              // common js
import 'dotenv/config';                     // module js

// const express = require('express');      // common js
import express from 'express';              // module js

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {

    res.send("<h2>Welcome to first backend application.<br>This is the home page of the backend application.</h2>");
});

app.get('/signup', (req, res) => {

    res.send("<h4>Create account for efficient web browsing.</h4>");
});

app.get('/login', (req, res) => {

    res.send("<h4>For Login<br>Please enter username and password.");
});

app.get('/api/github', (req, res) => {

    const githubData = [
        {   
            id: 1,
            user: {
                "id": 153497984,
                "login": "azaadmottan",
            }
        },
        {
            id: 2,
            user: {
                "id": 153492545,
                "login": "sachinkumar",
            }
        },
        {
            id: 3,
            user: {
                "id": 153492356,
                "login": "rohitkumar",
            }
        },
        {
            id: 4,
            user: {
                "id": 534912547,
                "login": "dhamankaith",
            }
        }
    ]

    res.send(githubData);
});

app.listen(port, () => {

    console.log(`Application Serve at http://localhost:${port}`);
});

