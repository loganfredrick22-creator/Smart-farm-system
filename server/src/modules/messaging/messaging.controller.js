const httpStatus = require('http-status');
const msgService = require('./messaging.service');

const createConversation = async (req, res, next) => {
  try {
    const conversation = await msgService.getOrCreateConversation(
      [req.user.id, ...req.body.participantIds],
      req.user.farmId,
      req.body.subject
    );
    res.status(httpStatus.OK).json({ success: true, data: conversation });
  } catch (error) { next(error); }
};

const listConversations = async (req, res, next) => {
  try {
    const conversations = await msgService.getConversations(req.user.id);
    res.status(httpStatus.OK).json({ success: true, data: conversations });
  } catch (error) { next(error); }
};

const getConversation = async (req, res, next) => {
  try {
    const conversation = await msgService.getConversation(req.params.id);
    res.status(httpStatus.OK).json({ success: true, data: conversation });
  } catch (error) { next(error); }
};

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, messageType } = req.body;
    const result = await msgService.sendMessage(conversationId, req.user.id, content, messageType);
    res.status(httpStatus.CREATED).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const getMessages = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await msgService.getMessages(req.params.conversationId, req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
    });
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) { next(error); }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await msgService.getUnreadCount(req.user.id);
    res.status(httpStatus.OK).json({ success: true, data: { unreadCount: count } });
  } catch (error) { next(error); }
};

module.exports = { createConversation, listConversations, getConversation, sendMessage, getMessages, getUnreadCount };
