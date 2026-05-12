const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const httpStatus = require('http-status');
const env = require('../../config/env');
const { AppError } = require('../../middleware/errorHandler');
const authRepo = require('./auth.repository');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, farmId: user.farmId },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn }
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};

const register = async ({ firstName, lastName, email, password, phone, role }) => {
  const existing = await authRepo.findByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', httpStatus.CONFLICT);
  }

  const user = await authRepo.createUser({ firstName, lastName, email, password, phone, role: role || 'farmer' });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await authRepo.updateRefreshToken(user._id, refreshToken);
  await authRepo.updateLastLogin(user._id);

  return { user, accessToken, refreshToken };
};

const login = async (email, password) => {
  const user = await authRepo.findByEmail(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated. Contact admin.', httpStatus.FORBIDDEN);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await authRepo.updateRefreshToken(user._id, refreshToken);
  await authRepo.updateLastLogin(user._id);

  return { user, accessToken, refreshToken };
};

const refreshToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new AppError('Refresh token required', httpStatus.UNAUTHORIZED);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', httpStatus.UNAUTHORIZED);
  }

  const user = await authRepo.findByIdWithPassword(decoded.id);
  if (!user || !user.isActive) {
    throw new AppError('User not found or deactivated', httpStatus.UNAUTHORIZED);
  }

  if (user.refreshToken !== oldRefreshToken) {
    user.refreshToken = undefined;
    await user.save();
    throw new AppError('Refresh token reuse detected', httpStatus.UNAUTHORIZED);
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  await authRepo.updateRefreshToken(user._id, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
};

const logout = async (userId) => {
  await authRepo.updateRefreshToken(userId, null);
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await authRepo.findByIdWithPassword(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', httpStatus.BAD_REQUEST);
  }

  await authRepo.updatePassword(userId, newPassword);
  await authRepo.updateRefreshToken(userId, null);
};

const forgotPassword = async (email) => {
  const user = await authRepo.findByEmail(email);
  if (!user) {
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 3600000;
  await user.save();

  return { resetToken, email: user.email };
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await authRepo.findByEmail('__nonexistent__');
  const User = require('../users/user.model');
  const foundUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!foundUser) {
    throw new AppError('Invalid or expired reset token', httpStatus.BAD_REQUEST);
  }

  foundUser.password = newPassword;
  foundUser.passwordResetToken = undefined;
  foundUser.passwordResetExpires = undefined;
  foundUser.refreshToken = undefined;
  await foundUser.save();
};

module.exports = { register, login, refreshToken, logout, changePassword, forgotPassword, resetPassword, generateAccessToken };
