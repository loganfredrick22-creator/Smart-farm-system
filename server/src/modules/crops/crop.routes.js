const { Router } = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const controller = require('./crop.controller');
const { createCropSchema, updateCropSchema } = require('./crop.validation');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/stats/:farmId', authorize('admin', 'farmer'), controller.getStats);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getById);

router.post('/', authorize('admin', 'farmer'), validate(createCropSchema), controller.create);
router.patch('/:id', authorize('admin', 'farmer'), validate(updateCropSchema), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);
router.post('/:id/treatments', authorize('admin', 'farmer'), controller.addTreatment);

module.exports = router;
