const httpStatus = require('http-status');
const healthService = require('./health.service');

const create = async (req, res, next) => {
  try {
    const check = await healthService.createCheck(req.body, req.user.id, req.user.farmId);
    res.status(httpStatus.CREATED).json({ success: true, data: check });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const check = await healthService.getCheck(req.params.id);
    res.status(httpStatus.OK).json({ success: true, data: check });
  } catch (error) { next(error); }
};

const list = async (req, res, next) => {
  try {
    const { page, limit, livestockId, status } = req.query;
    const filter = { farmId: req.query.farmId || req.user.farmId };
    if (livestockId) filter.livestockId = livestockId;
    if (status) filter.status = status;
    const result = await healthService.listChecks(filter, { page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const check = await healthService.updateCheck(req.params.id, req.body);
    res.status(httpStatus.OK).json({ success: true, data: check });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await healthService.deleteCheck(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: 'Health record deleted' });
  } catch (error) { next(error); }
};

const getOpenCases = async (req, res, next) => {
  try {
    const cases = await healthService.getOpenCases(req.params.farmId || req.user.farmId);
    res.status(httpStatus.OK).json({ success: true, data: cases });
  } catch (error) { next(error); }
};

module.exports = { create, getById, list, update, remove, getOpenCases };
