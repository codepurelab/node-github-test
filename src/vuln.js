const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');

const app = express();
app.use(express.json());

// 1. HARDCODED SECRETS (Secret Scanning Gate)
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// 2. INSECURE CONFIGURATION (Disabling TLS/SSL validation)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get('/api/user', (req, res) => {
    // 3. SQL INJECTION (SQLi) - Concatenating raw user input into a SQL query
    const userId = req.query.id;
    const query = "SELECT * FROM users WHERE id = " + userId;
    db.execute(query); // Mock DB call
    res.send("User fetched");
});

app.get('/api/ping', (req, res) => {
    // 4. OS COMMAND INJECTION - Passing raw input to the system shell
    const ip = req.query.ip;
    exec("ping -c 1 " + ip, (error, stdout, stderr) => {
        res.send(stdout);
    });
});

app.get('/api/file', (req, res) => {
    // 5. PATH TRAVERSAL - Allowing users to read arbitrary files from the server
    const filename = req.query.name;
    const content = fs.readFileSync("/var/www/uploads/" + filename);
    res.send(content);
});

app.get('/api/echo', (req, res) => {
    // 6. CROSS-SITE SCRIPTING (XSS) - Reflecting unsanitized input directly to the DOM
    const input = req.query.input;
    res.send("<html><body>" + input + "</body></html>");
});

app.get('/api/reset-password', (req, res) => {
    // 7. INSECURE RANDOMNESS - Using non-cryptographic RNG for a sensitive token
    const resetToken = Math.random().toString(36).substring(2);
    res.send(`Password reset token sent: ${resetToken}`);
});

app.get('/api/hash', (req, res) => {
    // 8. WEAK CRYPTOGRAPHY - Using MD5, an obsolete and broken hashing algorithm
    const data = req.query.data;
    const hash = crypto.createHash('md5').update(data).digest('hex');
    res.send(`Your hash: ${hash}`);
});

app.get('/api/proxy', (req, res) => {
    // 9. SERVER-SIDE REQUEST FORGERY (SSRF) - Forcing the server to make unauthorized requests
    const targetUrl = req.query.url;
    http.get(targetUrl, (response) => {
        response.pipe(res);
    });
});

app.post('/api/calculate', (req, res) => {
    // 10. CODE INJECTION (Insecure Eval) - Executing raw strings as JavaScript code
    const userInput = req.body.math_expression;
    const result = eval(userInput);
    res.send(`Calculation Result: ${result}`);
});

app.listen(3000, () => console.log('Vulnerable server running on port 3000!'));
