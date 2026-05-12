const { Router } = require('express');
const authenticate = require('../../middleware/auth');
const controller = require('./messaging.controller');

const router = Router();

router.use(authenticate);

router.get('/conversations', controller.listConversations);
router.post('/conversations', controller.createConversation);
router.get('/conversations/:id', controller.getConversation);
router.get('/conversations/:conversationId/messages', controller.getMessages);
router.post('/messages', controller.sendMessage);
router.get('/unread-count', controller.getUnreadCount);

module.exports = router;
