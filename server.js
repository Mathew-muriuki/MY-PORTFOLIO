const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MySQL DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// ✅ File upload config using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // Ensure filename is unique and has proper extension
  }
});

const upload = multer({ storage });

// ✅ Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  const { title, description } = req.body;
  const filename = req.file.filename;

  const sql = 'INSERT INTO projects (title, description, filename) VALUES (?, ?, ?)';
  db.query(sql, [title, description, filename], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: '✅ File uploaded successfully' });
  });
});

// ✅ Fetch all projects
app.get('/api/projects', (req, res) => {
  const sql = 'SELECT * FROM projects ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Optional: Default homepage route
app.get('/', (req, res) => {
  res.send('📡 UTOPIA Portfolio API is running.');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
