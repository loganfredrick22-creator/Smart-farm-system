const mongoose = require('mongoose');
const Crop = require('./crop.model');

const create = async (data) => Crop.create(data);
const findById = async (id) => Crop.findById(id).populate('ownerId', 'firstName lastName');
const findAll = async (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Crop.find(filter).sort(sort).skip(skip).limit(limit),
    Crop.countDocuments(filter),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
};
const updateById = async (id, data) => Crop.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteById = async (id) => Crop.findByIdAndDelete(id);
const countByFarm = async (farmId) => Crop.countDocuments({ farmId });
const countByStatus = async (farmId) =>
  Crop.aggregate([
    { $match: { farmId: new mongoose.Types.ObjectId(farmId) } },
    { $group: { _id: '$status', count: { $sum: 1 }, totalArea: { $sum: '$area' } } },
  ]);
const addTreatment = async (cropId, data) =>
  Crop.findByIdAndUpdate(cropId, { $push: { treatments: data } }, { new: true, runValidators: true });
const addCycle = async (cropId, data) =>
  Crop.findByIdAndUpdate(cropId, { $push: { growthCycles: data } }, { new: true, runValidators: true });

module.exports = { create, findById, findAll, updateById, deleteById, countByFarm, countByStatus, addTreatment, addCycle };
