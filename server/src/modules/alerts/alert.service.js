const httpStatus = require('http-status');
const { AppError } = require('../../middleware/errorHandler');
const alertRepo = require('./alert.repository');

const createAlert = async (data) => alertRepo.create(data);

const listAlerts = async (filter, options) => alertRepo.findAll(filter, options);

const markRead = async (id, userId) => {
  const alert = await alertRepo.findById(id);
  if (!alert) throw new AppError('Alert not found', httpStatus.NOT_FOUND);
  return alertRepo.markAsRead(id);
};

const markAllRead = async (userId) => alertRepo.markAllAsRead(userId);

const resolve = async (id) => {
  const alert = await alertRepo.findById(id);
  if (!alert) throw new AppError('Alert not found', httpStatus.NOT_FOUND);
  return alertRepo.resolveAlert(id);
};

const deleteAlert = async (id) => {
  const alert = await alertRepo.findById(id);
  if (!alert) throw new AppError('Alert not found', httpStatus.NOT_FOUND);
  await alertRepo.deleteById(id);
};

const getUnreadCount = async (userId) => alertRepo.getUnreadCount(userId);

const getActionRequiredAlerts = async (farmId) => alertRepo.getActionRequired(farmId);

module.exports = { createAlert, listAlerts, markRead, markAllRead, resolve, deleteAlert, getUnreadCount, getActionRequiredAlerts };
