const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const serialize = require('node-serialize');
const libxmljs = require('libxmljs');
const crypto = require('crypto');

const router = express.Router();
const db = require('./mock-db'); // Mock DB

// 1. SQL Injection (SQLi)
router.post('/login', (req, res) => {
    db.query("SELECT * FROM users WHERE username = '" + req.body.user + "'");
});

// 2. NoSQL Injection
router.post('/search', (req, res) => {
    db.collection('users').find({ $where: "this.name == '" + req.body.name + "'" });
});

// 3. OS Command Injection
router.get('/ping', (req, res) => {
    exec("ping -c 1 " + req.query.ip);
});

// 4. Path Traversal (LFI)
router.get('/download', (req, res) => {
    const data = fs.readFileSync("/var/www/uploads/" + req.query.file);
    res.send(data);
});

// 5. Server-Side Request Forgery (SSRF)
router.get('/proxy', (req, res) => {
    axios.get(req.query.url).then(response => res.send(response.data));
});

// 6. Cross-Site Scripting (Reflected XSS)
router.get('/greet', (req, res) => {
    res.send("<h1>Hello, " + req.query.name + "</h1>");
});

// 7. Insecure Deserialization
router.post('/profile', (req, res) => {
    const obj = serialize.unserialize(req.body.profile);
    res.send("Profile loaded");
});

// 8. XML External Entity (XXE)
router.post('/upload-xml', (req, res) => {
    const xmlDoc = libxmljs.parseXmlString(req.body.xml, { noent: true });
    res.send("XML Parsed");
});

// 9. Hardcoded Cryptographic Key & Weak Crypto (MD5)
router.get('/encrypt', (req, res) => {
    const secretKey = "SUPER_SECRET_STATIC_KEY_123!"; // Hardcoded secret
    const hash = crypto.createHash('md5').update(req.query.data).digest('hex'); // Weak algorithm
    res.send(hash);
});

// 10. Open Redirect
router.get('/redirect', (req, res) => {
    res.redirect(req.query.target_url);
});

module.exports = router;
