require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // serve uploaded files

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test connection
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to MySQL database.');
});

// Storage settings for uploading files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// API route: Upload project (for future steps)
app.post('/upload', upload.fields([{ name: 'file' }, { name: 'image' }]), (req, res) => {
    const { title, description } = req.body;
    const file_path = req.files['file'][0].path;
    const image_path = req.files['image'][0].path;

    const sql = "INSERT INTO projects (title, description, file_path, image_path) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, description, file_path, image_path], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json({ message: 'Project uploaded successfully!' });
        }
    });
});

// API route: Fetch all projects
app.get('/projects', (req, res) => {
    const sql = "SELECT * FROM projects";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
