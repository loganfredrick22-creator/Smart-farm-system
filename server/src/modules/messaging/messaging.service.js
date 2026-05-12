const httpStatus = require('http-status');
const { AppError } = require('../../middleware/errorHandler');
const msgRepo = require('./messaging.repository');

const getOrCreateConversation = async (participants, farmId, subject) => {
  let conversation = await msgRepo.findConversationByParticipants(participants, farmId);
  if (!conversation) {
    conversation = await msgRepo.createConversation({ participants, farmId, subject });
  }
  return conversation;
};

const getConversations = async (userId) => msgRepo.findUserConversations(userId);

const getConversation = async (conversationId) => {
  const conversation = await msgRepo.findConversationById(conversationId);
  if (!conversation) throw new AppError('Conversation not found', httpStatus.NOT_FOUND);
  return conversation;
};

const sendMessage = async (conversationId, senderId, content, messageType, attachment) => {
  const conversation = await msgRepo.findConversationById(conversationId);
  if (!conversation) throw new AppError('Conversation not found', httpStatus.NOT_FOUND);
  if (!conversation.participants.some((p) => (p._id || p).toString() === senderId)) {
    throw new AppError('Not a participant of this conversation', httpStatus.FORBIDDEN);
  }
  const message = await msgRepo.createMessage({
    conversationId, senderId, content, messageType, attachment,
  });
  const populatedMessage = await msgRepo.findMessagesByConversation(conversationId, { limit: 1 });
  await msgRepo.updateConversationLastMessage(conversationId, {
    content, senderId, sentAt: message.createdAt,
  });
  return { message: (await msgRepo.findMessagesByConversation(conversationId, { limit: 1 })).messages[0] || message };
};

const getMessages = async (conversationId, userId, options) => {
  const conversation = await msgRepo.findConversationById(conversationId);
  if (!conversation) throw new AppError('Conversation not found', httpStatus.NOT_FOUND);
  if (!conversation.participants.some((p) => (p._id || p).toString() === userId)) {
    throw new AppError('Not a participant', httpStatus.FORBIDDEN);
  }
  const result = await msgRepo.findMessagesByConversation(conversationId, options);
  await msgRepo.markMessagesAsRead(conversationId, userId);
  return result;
};

const getUnreadCount = async (userId) => msgRepo.countUnreadMessages(userId);

module.exports = { getOrCreateConversation, getConversations, getConversation, sendMessage, getMessages, getUnreadCount };
