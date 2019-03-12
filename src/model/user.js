const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: String,
    select: false,
  },
  tokenIsUsed: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre('save', async function (next) {
  if (this.password) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
  }
});

UserSchema.methods.gravatar = (size = 200) => {
  if (!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;

  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

module.exports = mongoose.model('user', UserSchema);