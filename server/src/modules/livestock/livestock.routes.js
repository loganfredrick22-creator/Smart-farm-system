const { Router } = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const controller = require('./livestock.controller');
const { createLivestockSchema, updateLivestockSchema, addVaccinationSchema, addMedicalRecordSchema, addBreedingSchema } = require('./livestock.validation');

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/stats/:farmId', authorize('admin', 'farmer'), controller.getStats);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getById);

router.post('/', authorize('admin', 'farmer'), validate(createLivestockSchema), controller.create);
router.patch('/:id', authorize('admin', 'farmer'), validate(updateLivestockSchema), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);

router.post('/:id/vaccinations', authorize('admin', 'farmer', 'vet'), validate(addVaccinationSchema), controller.addVaccination);
router.post('/:id/medical-records', authorize('admin', 'vet'), validate(addMedicalRecordSchema), controller.addMedicalRecord);
router.post('/:id/breeding', authorize('admin', 'farmer'), validate(addBreedingSchema), controller.addBreeding);

module.exports = router;
