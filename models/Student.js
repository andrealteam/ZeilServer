const mongoose = require('mongoose');
const validator = require('validator');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Student', studentSchema);
