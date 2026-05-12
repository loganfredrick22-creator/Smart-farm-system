const HealthCheck = require('./health.model');

const create = async (data) => HealthCheck.create(data);
const findById = async (id) => HealthCheck.findById(id).populate('veterinarianId', 'firstName lastName email');
const findAll = async (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    HealthCheck.find(filter).sort(sort).skip(skip).limit(limit)
      .populate('veterinarianId', 'firstName lastName')
      .populate('livestockId', 'tagId species breed'),
    HealthCheck.countDocuments(filter),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
};
const updateById = async (id, data) => HealthCheck.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteById = async (id) => HealthCheck.findByIdAndDelete(id);

const getOpenCases = async (farmId) =>
  HealthCheck.find({ farmId, status: { $in: ['open', 'follow_up_required'] } })
    .populate('livestockId', 'tagId species breed')
    .sort({ createdAt: -1 });

module.exports = { create, findById, findAll, updateById, deleteById, getOpenCases };
