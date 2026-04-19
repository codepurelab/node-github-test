const express = require('express');
const { exec } = require('child_process');
const db = require('./mock-db');

const app = express();

app.get('/ping', (req, res) => {
    // OS Command Injection
    exec("ping -c 1 " + req.query.ip, (err, stdout) => res.send(stdout));
});

app.post('/login', (req, res) => {
    // SQL Injection
    db.query("SELECT * FROM users WHERE username = '" + req.body.user + "'");
    res.send("Attempted login");
});

app.listen(3000);
