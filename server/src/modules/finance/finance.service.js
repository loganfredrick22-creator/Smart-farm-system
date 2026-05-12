const httpStatus = require('http-status');
const { AppError } = require('../../middleware/errorHandler');
const financeRepo = require('./finance.repository');

const createTransaction = async (data, userId, farmId) =>
  financeRepo.createTransaction({ ...data, createdBy: userId, farmId });

const listTransactions = async (filter, options) => financeRepo.findAllTransactions(filter, options);

const getTransaction = async (id) => {
  const tx = await financeRepo.findTransactionById(id);
  if (!tx) throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
  return tx;
};

const updateTransaction = async (id, data) => {
  const tx = await financeRepo.findTransactionById(id);
  if (!tx) throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
  return financeRepo.updateTransaction(id, data);
};

const deleteTransaction = async (id) => {
  const tx = await financeRepo.findTransactionById(id);
  if (!tx) throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
  await financeRepo.deleteTransaction(id);
};

const getFinancialSummary = async (farmId, startDate, endDate) => {
  const results = await financeRepo.getFinancialSummary(farmId, startDate, endDate);
  const summary = { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 };
  for (const r of results) {
    summary[r._id] = r.total;
    summary[`${r._id}Count`] = r.count;
  }
  summary.net = summary.income - summary.expense;
  return summary;
};

const getCategoryBreakdown = async (farmId, startDate, endDate) =>
  financeRepo.getCategoryBreakdown(farmId, startDate, endDate);

const createBudget = async (data, userId, farmId) =>
  financeRepo.createBudget({ ...data, createdBy: userId, farmId });

const listBudgets = async (filter) => financeRepo.findAllBudgets(filter);

const updateBudget = async (id, data) => {
  const budget = await financeRepo.findBudgetById(id);
  if (!budget) throw new AppError('Budget not found', httpStatus.NOT_FOUND);
  return financeRepo.updateBudget(id, data);
};

const deleteBudget = async (id) => {
  const budget = await financeRepo.findBudgetById(id);
  if (!budget) throw new AppError('Budget not found', httpStatus.NOT_FOUND);
  await financeRepo.deleteBudget(id);
};

module.exports = {
  createTransaction, listTransactions, getTransaction, updateTransaction, deleteTransaction,
  getFinancialSummary, getCategoryBreakdown,
  createBudget, listBudgets, updateBudget, deleteBudget,
};
