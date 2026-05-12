const httpStatus = require('http-status');
const livestockService = require('./livestock.service');

const create = async (req, res, next) => {
  try {
    const livestock = await livestockService.createLivestock(req.body, req.user.id, req.user.farmId);
    res.status(httpStatus.CREATED).json({ success: true, data: livestock });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const livestock = await livestockService.getLivestock(req.params.id);
    res.status(httpStatus.OK).json({ success: true, data: livestock });
  } catch (error) { next(error); }
};

const list = async (req, res, next) => {
  try {
    const { page, limit, species, status, healthStatus, farmId } = req.query;
    const filter = { farmId: farmId || req.user.farmId };
    if (species) filter.species = species;
    if (status) filter.status = status;
    if (healthStatus) filter.healthStatus = healthStatus;
    const result = await livestockService.listLivestock(filter, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const livestock = await livestockService.updateLivestock(req.params.id, req.body, req.user.id, req.user.role);
    res.status(httpStatus.OK).json({ success: true, data: livestock });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await livestockService.deleteLivestock(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: 'Livestock deleted' });
  } catch (error) { next(error); }
};

const addVaccination = async (req, res, next) => {
  try {
    const livestock = await livestockService.addVaccination(req.params.id, req.body, req.user.id);
    res.status(httpStatus.OK).json({ success: true, data: livestock });
  } catch (error) { next(error); }
};

const addMedicalRecord = async (req, res, next) => {
  try {
    const livestock = await livestockService.addMedicalRecord(req.params.id, req.body, req.user.id);
    res.status(httpStatus.OK).json({ success: true, data: livestock });
  } catch (error) { next(error); }
};

const addBreeding = async (req, res, next) => {
  try {
    const livestock = await livestockService.addBreeding(req.params.id, req.body);
    res.status(httpStatus.OK).json({ success: true, data: livestock });
  } catch (error) { next(error); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await livestockService.getLivestockStats(req.params.farmId || req.user.farmId);
    res.status(httpStatus.OK).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

module.exports = { create, getById, list, update, remove, addVaccination, addMedicalRecord, addBreeding, getStats };
