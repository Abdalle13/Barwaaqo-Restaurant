const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide your full name'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email address'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: { 
    type: String, 
    required: [true, 'Please provide a valid phone number'],
    trim: true,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  status: { 
    type: String, 
    enum: ['active', 'blocked'], 
    default: 'active' 
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  }
}, { timestamps: true });

// Password hashing before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);