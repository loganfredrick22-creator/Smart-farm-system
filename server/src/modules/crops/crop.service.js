const httpStatus = require('http-status');
const { AppError } = require('../../middleware/errorHandler');
const cropRepo = require('./crop.repository');

const createCrop = async (data, userId, farmId) =>
  cropRepo.create({ ...data, ownerId: userId, farmId });

const getCrop = async (id) => {
  const crop = await cropRepo.findById(id);
  if (!crop) throw new AppError('Crop not found', httpStatus.NOT_FOUND);
  return crop;
};

const listCrops = async (filter, options) => cropRepo.findAll(filter, options);

const updateCrop = async (id, data) => {
  const crop = await cropRepo.findById(id);
  if (!crop) throw new AppError('Crop not found', httpStatus.NOT_FOUND);
  return cropRepo.updateById(id, data);
};

const deleteCrop = async (id) => {
  const crop = await cropRepo.findById(id);
  if (!crop) throw new AppError('Crop not found', httpStatus.NOT_FOUND);
  await cropRepo.deleteById(id);
};

const getCropStats = async (farmId) => {
  const [total, byStatus] = await Promise.all([
    cropRepo.countByFarm(farmId),
    cropRepo.countByStatus(farmId),
  ]);
  return { total, byStatus };
};

const addTreatment = async (cropId, data) => {
  const crop = await cropRepo.findById(cropId);
  if (!crop) throw new AppError('Crop not found', httpStatus.NOT_FOUND);
  return cropRepo.addTreatment(cropId, data);
};

module.exports = { createCrop, getCrop, listCrops, updateCrop, deleteCrop, getCropStats, addTreatment };
