const Student = require('../models/Student');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');

// @desc    Register a new student
// @route   POST /api/v1/students
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, phone } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student with this email already exists',
      });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      phone,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: student,
      message: 'Student registered successfully',
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all students
// @route   GET /api/v1/students
// @access  Public
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
