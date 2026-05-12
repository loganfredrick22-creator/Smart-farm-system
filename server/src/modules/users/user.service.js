const httpStatus = require('http-status');
const { AppError } = require('../../middleware/errorHandler');
const userRepo = require('./user.repository');

const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);
  return user;
};

const updateProfile = async (userId, data) => {
  const allowed = ['firstName', 'lastName', 'phone', 'avatar'];
  const updates = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updates[key] = data[key];
  }
  const user = await userRepo.updateUser(userId, updates);
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);
  return user;
};

const listUsers = async (filter, options) => {
  return userRepo.findAll(filter, options);
};

const manageUserStatus = async (userId, action) => {
  const user = action === 'deactivate'
    ? await userRepo.deactivateUser(userId)
    : await userRepo.activateUser(userId);
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);
  return user;
};

const getDashboardStats = async (farmId) => {
  const farmerCount = await userRepo.countByRole('farmer');
  const vetCount = await userRepo.countByRole('vet');
  const totalUsers = farmerCount + vetCount;
  return { totalUsers, farmerCount, vetCount };
};

module.exports = { getProfile, updateProfile, listUsers, manageUserStatus, getDashboardStats };
