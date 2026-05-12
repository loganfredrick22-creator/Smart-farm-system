const httpStatus = require('http-status');
const cropService = require('./crop.service');

const create = async (req, res, next) => {
  try {
    const crop = await cropService.createCrop(req.body, req.user.id, req.user.farmId);
    res.status(httpStatus.CREATED).json({ success: true, data: crop });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const crop = await cropService.getCrop(req.params.id);
    res.status(httpStatus.OK).json({ success: true, data: crop });
  } catch (error) { next(error); }
};

const list = async (req, res, next) => {
  try {
    const { page, limit, season, year, status } = req.query;
    const filter = { farmId: req.query.farmId || req.user.farmId };
    if (season) filter.season = season;
    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;
    const result = await cropService.listCrops(filter, { page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const crop = await cropService.updateCrop(req.params.id, req.body);
    res.status(httpStatus.OK).json({ success: true, data: crop });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await cropService.deleteCrop(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: 'Crop deleted' });
  } catch (error) { next(error); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await cropService.getCropStats(req.params.farmId || req.user.farmId);
    res.status(httpStatus.OK).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

const addTreatment = async (req, res, next) => {
  try {
    const crop = await cropService.addTreatment(req.params.id, req.body);
    res.status(httpStatus.OK).json({ success: true, data: crop });
  } catch (error) { next(error); }
};

module.exports = { create, getById, list, update, remove, getStats, addTreatment };
