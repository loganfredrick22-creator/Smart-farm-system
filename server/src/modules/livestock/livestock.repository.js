const mongoose = require('mongoose');
const Livestock = require('./livestock.model');

const create = async (data) => Livestock.create(data);

const findById = async (id) => Livestock.findById(id).populate('ownerId', 'firstName lastName email');

const findByTagId = async (tagId) => Livestock.findOne({ tagId: tagId.toUpperCase() });

const findAll = async (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Livestock.find(filter).sort(sort).skip(skip).limit(limit).populate('ownerId', 'firstName lastName'),
    Livestock.countDocuments(filter),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
};

const updateById = async (id, data) =>
  Livestock.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = async (id) => Livestock.findByIdAndDelete(id);

const countByFarm = async (farmId) => Livestock.countDocuments({ farmId });

const countBySpecies = async (farmId) =>
  Livestock.aggregate([
    { $match: { farmId: new mongoose.Types.ObjectId(farmId) } },
    { $group: { _id: '$species', count: { $sum: 1 } } },
  ]);

const countByHealthStatus = async (farmId) =>
  Livestock.aggregate([
    { $match: { farmId: new mongoose.Types.ObjectId(farmId) } },
    { $group: { _id: '$healthStatus', count: { $sum: 1 } } },
  ]);

const findDueVaccinations = async (days = 7) => {
  const target = new Date();
  target.setDate(target.getDate() + days);
  return Livestock.find({ 'vaccinations.nextDueDate': { $lte: target } });
};

const addSubdocument = async (livestockId, path, data) =>
  Livestock.findByIdAndUpdate(
    livestockId,
    { $push: { [path]: data } },
    { new: true, runValidators: true }
  );

module.exports = { create, findById, findByTagId, findAll, updateById, deleteById, countByFarm, countBySpecies, countByHealthStatus, findDueVaccinations, addSubdocument };
