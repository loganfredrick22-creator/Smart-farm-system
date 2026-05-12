const httpStatus = require('http-status');
const { AppError } = require('../../middleware/errorHandler');
const healthRepo = require('./health.repository');

const createCheck = async (data, userId, farmId) =>
  healthRepo.create({ ...data, veterinarianId: userId, farmId });

const getCheck = async (id) => {
  const check = await healthRepo.findById(id);
  if (!check) throw new AppError('Health check not found', httpStatus.NOT_FOUND);
  return check;
};

const listChecks = async (filter, options) => healthRepo.findAll(filter, options);

const updateCheck = async (id, data) => {
  const check = await healthRepo.findById(id);
  if (!check) throw new AppError('Health check not found', httpStatus.NOT_FOUND);
  return healthRepo.updateById(id, data);
};

const deleteCheck = async (id) => {
  const check = await healthRepo.findById(id);
  if (!check) throw new AppError('Health check not found', httpStatus.NOT_FOUND);
  await healthRepo.deleteById(id);
};

const getOpenCases = async (farmId) => healthRepo.getOpenCases(farmId);

module.exports = { createCheck, getCheck, listChecks, updateCheck, deleteCheck, getOpenCases };
