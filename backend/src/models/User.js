const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Fadlan geli magacaaga'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Fadlan geli email-ka'], 
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Fadlan geli email sax ah'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Fadlan geli password-ka'],
    minlength: [6, 'Password-ku waa inuu ka badnaadaa 6 harfood']
  },
  phone: { 
    type: String, 
    required: [true, 'Fadlan geli lambarka talefanka'],
    // Somalian phone numbers are usually 9-10 digits
    match: [/^\d{9,12}$/, 'Fadlan geli lambar talefan oo sax ah (9-12 digital)']
  },
  profileImage: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ['active', 'blocked'], 
    default: 'active' 
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }
}, { timestamps: true });

// Password hashing (sidii hore)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);