const { Router } = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const controller = require('./user.controller');

const router = Router();

router.get('/profile', authenticate, controller.getProfile);
router.patch('/profile', authenticate, controller.updateProfile);
router.get('/', authenticate, authorize('admin'), controller.listUsers);
router.patch('/:id/status', authenticate, authorize('admin'), controller.toggleUserStatus);

module.exports = router;
