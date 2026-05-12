const User = require('../users/user.model');

const createUser = async (userData) => {
  const user = await User.create(userData);
  return User.findById(user._id);
};

const findByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
};

const findById = async (id) => {
  return User.findById(id);
};

const findByIdWithPassword = async (id) => {
  return User.findById(id).select('+password +refreshToken');
};

const updateRefreshToken = async (userId, refreshToken) => {
  return User.findByIdAndUpdate(userId, { refreshToken }, { new: true }).select('+refreshToken');
};

const updatePassword = async (userId, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) return null;
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();
  return User.findById(userId);
};

const updateLastLogin = async (userId) => {
  return User.findByIdAndUpdate(userId, { lastLogin: new Date() }, { new: true });
};

module.exports = { createUser, findByEmail, findById, findByIdWithPassword, updateRefreshToken, updatePassword, updateLastLogin };
