const mongoose = require('mongoose');
const { Transaction, Budget } = require('./finance.model');

const createTransaction = async (data) => Transaction.create(data);
const findTransactionById = async (id) => Transaction.findById(id);
const findAllTransactions = async (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { date: -1 } } = options;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Transaction.find(filter).sort(sort).skip(skip).limit(limit).populate('createdBy', 'firstName lastName'),
    Transaction.countDocuments(filter),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
};
const updateTransaction = async (id, data) => Transaction.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteTransaction = async (id) => Transaction.findByIdAndDelete(id);

const getFinancialSummary = async (farmId, startDate, endDate) => {
  const match = { farmId: new mongoose.Types.ObjectId(farmId) };
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }
  return Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
};

const getCategoryBreakdown = async (farmId, startDate, endDate) => {
  const match = { farmId: new mongoose.Types.ObjectId(farmId) };
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }
  return Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

const createBudget = async (data) => Budget.create(data);
const findBudgetById = async (id) => Budget.findById(id);
const findAllBudgets = async (filter = {}) => Budget.find(filter).sort({ year: -1, month: -1 });
const updateBudget = async (id, data) => Budget.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteBudget = async (id) => Budget.findByIdAndDelete(id);

module.exports = {
  createTransaction, findTransactionById, findAllTransactions, updateTransaction, deleteTransaction,
  getFinancialSummary, getCategoryBreakdown,
  createBudget, findBudgetById, findAllBudgets, updateBudget, deleteBudget,
};
