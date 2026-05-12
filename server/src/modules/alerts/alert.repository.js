const Alert = require('./alert.model');

const create = async (data) => Alert.create(data);
const createMany = async (alerts) => Alert.insertMany(alerts);
const findById = async (id) => Alert.findById(id);
const findAll = async (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Alert.find(filter).sort(sort).skip(skip).limit(limit),
    Alert.countDocuments(filter),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
};
const markAsRead = async (id) => Alert.findByIdAndUpdate(id, { isRead: true }, { new: true });
const markAllAsRead = async (userId) => Alert.updateMany({ userId, isRead: false }, { isRead: true });
const resolveAlert = async (id) => Alert.findByIdAndUpdate(id, { isResolved: true, isRead: true }, { new: true });
const deleteById = async (id) => Alert.findByIdAndDelete(id);

const getUnreadCount = async (userId) => Alert.countDocuments({ userId, isRead: false });
const getActionRequired = async (farmId) =>
  Alert.find({ farmId, actionRequired: true, isResolved: false }).sort({ createdAt: -1 });

module.exports = { create, createMany, findById, findAll, markAsRead, markAllAsRead, resolveAlert, deleteById, getUnreadCount, getActionRequired };
