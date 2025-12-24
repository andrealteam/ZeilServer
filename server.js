require('dotenv').config();
require('colors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const connectDB = require('./config/db');
const studentController = require('./controllers/studentController');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
const router = express.Router();

// Validation middleware
const validateStudent = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits')
];

// Student Routes
router.post(
  '/students',
  validateStudent,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  },
  studentController.registerStudent
);

router.get('/students', studentController.getStudents);

// API prefix
app.use('/api/v1', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;
