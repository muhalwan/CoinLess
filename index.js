const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const client = require('./db/conn');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: '*' }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Serve the frontend HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/toko', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'toko.html'));
});

app.get('/my', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Connect to the database
client.connect();