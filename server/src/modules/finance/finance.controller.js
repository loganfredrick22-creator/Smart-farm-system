const httpStatus = require('http-status');
const financeService = require('./finance.service');

const createTransaction = async (req, res, next) => {
  try {
    const tx = await financeService.createTransaction(req.body, req.user.id, req.user.farmId);
    res.status(httpStatus.CREATED).json({ success: true, data: tx });
  } catch (error) { next(error); }
};

const listTransactions = async (req, res, next) => {
  try {
    const { page, limit, type, category, startDate, endDate } = req.query;
    const filter = { farmId: req.query.farmId || req.user.farmId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const result = await financeService.listTransactions(filter, { page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) { next(error); }
};

const getTransaction = async (req, res, next) => {
  try {
    const tx = await financeService.getTransaction(req.params.id);
    res.status(httpStatus.OK).json({ success: true, data: tx });
  } catch (error) { next(error); }
};

const updateTransaction = async (req, res, next) => {
  try {
    const tx = await financeService.updateTransaction(req.params.id, req.body);
    res.status(httpStatus.OK).json({ success: true, data: tx });
  } catch (error) { next(error); }
};

const deleteTransaction = async (req, res, next) => {
  try {
    await financeService.deleteTransaction(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: 'Transaction deleted' });
  } catch (error) { next(error); }
};

const getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await financeService.getFinancialSummary(req.params.farmId || req.user.farmId, startDate, endDate);
    res.status(httpStatus.OK).json({ success: true, data: summary });
  } catch (error) { next(error); }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const breakdown = await financeService.getCategoryBreakdown(req.params.farmId || req.user.farmId, startDate, endDate);
    res.status(httpStatus.OK).json({ success: true, data: breakdown });
  } catch (error) { next(error); }
};

const createBudget = async (req, res, next) => {
  try {
    const budget = await financeService.createBudget(req.body, req.user.id, req.user.farmId);
    res.status(httpStatus.CREATED).json({ success: true, data: budget });
  } catch (error) { next(error); }
};

const listBudgets = async (req, res, next) => {
  try {
    const filter = { farmId: req.query.farmId || req.user.farmId };
    if (req.query.year) filter.year = parseInt(req.query.year);
    if (req.query.period) filter.period = req.query.period;
    const budgets = await financeService.listBudgets(filter);
    res.status(httpStatus.OK).json({ success: true, data: budgets });
  } catch (error) { next(error); }
};

const updateBudget = async (req, res, next) => {
  try {
    const budget = await financeService.updateBudget(req.params.id, req.body);
    res.status(httpStatus.OK).json({ success: true, data: budget });
  } catch (error) { next(error); }
};

const deleteBudget = async (req, res, next) => {
  try {
    await financeService.deleteBudget(req.params.id);
    res.status(httpStatus.OK).json({ success: true, message: 'Budget deleted' });
  } catch (error) { next(error); }
};

module.exports = {
  createTransaction, listTransactions, getTransaction, updateTransaction, deleteTransaction,
  getSummary, getCategoryBreakdown,
  createBudget, listBudgets, updateBudget, deleteBudget,
};
