const User = require('./user.model');

const findById = async (id) => User.findById(id);
const findAll = async (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return { users, total, page, totalPages: Math.ceil(total / limit) };
};
const updateUser = async (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deactivateUser = async (id) => User.findByIdAndUpdate(id, { isActive: false }, { new: true });
const activateUser = async (id) => User.findByIdAndUpdate(id, { isActive: true }, { new: true });
const deleteUser = async (id) => User.findByIdAndDelete(id);
const countByRole = async (role) => User.countDocuments({ role, isActive: true });

module.exports = { findById, findAll, updateUser, deactivateUser, activateUser, deleteUser, countByRole };
