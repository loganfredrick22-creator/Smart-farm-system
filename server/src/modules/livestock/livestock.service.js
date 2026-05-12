const httpStatus = require('http-status');
const { AppError } = require('../../middleware/errorHandler');
const livestockRepo = require('./livestock.repository');

const createLivestock = async (data, userId, farmId) => {
  const existing = await livestockRepo.findByTagId(data.tagId);
  if (existing) {
    throw new AppError(`Tag ID ${data.tagId} already exists`, httpStatus.CONFLICT);
  }
  return livestockRepo.create({ ...data, ownerId: userId, farmId });
};

const getLivestock = async (id) => {
  const item = await livestockRepo.findById(id);
  if (!item) throw new AppError('Livestock not found', httpStatus.NOT_FOUND);
  return item;
};

const listLivestock = async (filter, options) => {
  return livestockRepo.findAll(filter, options);
};

const updateLivestock = async (id, data, userId, userRole) => {
  const item = await livestockRepo.findById(id);
  if (!item) throw new AppError('Livestock not found', httpStatus.NOT_FOUND);
  const ownerId = item.ownerId?._id || item.ownerId;
  if (ownerId.toString() !== userId && userRole !== 'admin') {
    throw new AppError('Not authorized to update this livestock', httpStatus.FORBIDDEN);
  }
  return livestockRepo.updateById(id, data);
};

const deleteLivestock = async (id) => {
  const item = await livestockRepo.findById(id);
  if (!item) throw new AppError('Livestock not found', httpStatus.NOT_FOUND);
  await livestockRepo.deleteById(id);
};

const addVaccination = async (livestockId, data, userId) => {
  const item = await livestockRepo.findById(livestockId);
  if (!item) throw new AppError('Livestock not found', httpStatus.NOT_FOUND);
  return livestockRepo.addSubdocument(livestockId, 'vaccinations', {
    ...data,
    administeredBy: userId,
  });
};

const addMedicalRecord = async (livestockId, data, userId) => {
  const item = await livestockRepo.findById(livestockId);
  if (!item) throw new AppError('Livestock not found', httpStatus.NOT_FOUND);
  return livestockRepo.addSubdocument(livestockId, 'medicalRecords', {
    ...data,
    veterinarianId: userId,
  });
};

const addBreeding = async (livestockId, data) => {
  const item = await livestockRepo.findById(livestockId);
  if (!item) throw new AppError('Livestock not found', httpStatus.NOT_FOUND);
  return livestockRepo.addSubdocument(livestockId, 'breedingHistory', data);
};

const getLivestockStats = async (farmId) => {
  const [total, bySpecies, byHealth] = await Promise.all([
    livestockRepo.countByFarm(farmId),
    livestockRepo.countBySpecies(farmId),
    livestockRepo.countByHealthStatus(farmId),
  ]);
  return { total, bySpecies, byHealth };
};

module.exports = { createLivestock, getLivestock, listLivestock, updateLivestock, deleteLivestock, addVaccination, addMedicalRecord, addBreeding, getLivestockStats };
