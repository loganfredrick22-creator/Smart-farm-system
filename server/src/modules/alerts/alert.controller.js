const httpStatus = require('http-status');
const alertService = require('./alert.service');

const create = async (req, res, next) => {
  try {
    const alert = await alertService.createAlert({ ...req.body, farmId: req.user.farmId });
    res.status(httpStatus.CREATED).json({ success: true, data: alert });
  } catch (error) { next(error); }
};

const list = async (req, res, next) => {
  try {
    const { page, limit, type, severity, isRead, isResolved } = req.query;
    const filter = { farmId: req.query.farmId || req.user.farmId };
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (isResolved !== undefined) filter.isResolved = isResolved === 'true';
    const result = await alertService.listAlerts(filter, { page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) { next(error); }
};

const markRead = async (req, res, next) => {
  try {
    const alert = await alertService.markRead(req.params.id, req.user.id);
    res.status(httpStatus.OK).json({ success: true, data: alert });
  } catch (error) { next(error); }
};

const markAllRead = async (req, res, next) => {
  try {
    await alertService.markAllRead(req.user.id);
    res.status(httpStatus.OK).json({ success: true, message: 'All alerts marked as read' });
  } catch (error) { next(error); }
};

const resolve = async (req, res, next) => {
  try {
    const alert = await alertService.resolve(req.params.id);
    res.status(httpStatus.OK).json({ success: true, data: alert });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await alertService.deleteAlert(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: 'Alert deleted' });
  } catch (error) { next(error); }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await alertService.getUnreadCount(req.user.id);
    res.status(httpStatus.OK).json({ success: true, data: { unreadCount: count } });
  } catch (error) { next(error); }
};

const getActionRequired = async (req, res, next) => {
  try {
    const alerts = await alertService.getActionRequiredAlerts(req.params.farmId || req.user.farmId);
    res.status(httpStatus.OK).json({ success: true, data: alerts });
  } catch (error) { next(error); }
};

module.exports = { create, list, markRead, markAllRead, resolve, remove, getUnreadCount, getActionRequired };
