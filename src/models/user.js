const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
