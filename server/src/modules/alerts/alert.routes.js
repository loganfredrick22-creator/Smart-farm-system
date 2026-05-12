const { Router } = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const controller = require('./alert.controller');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/unread-count', controller.getUnreadCount);
router.get('/action-required/:farmId', authorize('admin', 'farmer'), controller.getActionRequired);
router.get('/action-required', controller.getActionRequired);

router.post('/', authorize('admin'), controller.create);
router.patch('/:id/read', controller.markRead);
router.patch('/mark-all-read', controller.markAllRead);
router.patch('/:id/resolve', authorize('admin', 'farmer'), controller.resolve);
router.delete('/:id', authorize('admin'), controller.remove);

module.exports = router;
