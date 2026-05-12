const { Router } = require('express');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const controller = require('./auth.controller');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } = require('./auth.validation');

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), controller.changePassword);
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);
router.get('/me', authenticate, controller.getMe);

module.exports = router;
