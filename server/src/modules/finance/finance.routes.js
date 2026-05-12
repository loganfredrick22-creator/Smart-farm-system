const { Router } = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const controller = require('./finance.controller');
const { createTransactionSchema, createBudgetSchema } = require('./finance.validation');

const router = Router();

router.use(authenticate);

router.get('/transactions', controller.listTransactions);
router.get('/transactions/:id', controller.getTransaction);
router.post('/transactions', authorize('admin', 'farmer'), validate(createTransactionSchema), controller.createTransaction);
router.patch('/transactions/:id', authorize('admin', 'farmer'), controller.updateTransaction);
router.delete('/transactions/:id', authorize('admin'), controller.deleteTransaction);

router.get('/summary/:farmId', authorize('admin', 'farmer'), controller.getSummary);
router.get('/summary', controller.getSummary);
router.get('/category-breakdown/:farmId', authorize('admin', 'farmer'), controller.getCategoryBreakdown);
router.get('/category-breakdown', controller.getCategoryBreakdown);

router.get('/budgets', controller.listBudgets);
router.post('/budgets', authorize('admin', 'farmer'), validate(createBudgetSchema), controller.createBudget);
router.patch('/budgets/:id', authorize('admin', 'farmer'), controller.updateBudget);
router.delete('/budgets/:id', authorize('admin'), controller.deleteBudget);

module.exports = router;
