const { Router } = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const controller = require('./health.controller');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/open-cases/:farmId', authorize('admin', 'vet'), controller.getOpenCases);
router.get('/open-cases', authorize('admin', 'vet'), controller.getOpenCases);
router.get('/:id', controller.getById);

router.post('/', authorize('admin', 'vet'), controller.create);
router.patch('/:id', authorize('admin', 'vet'), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);

module.exports = router;
