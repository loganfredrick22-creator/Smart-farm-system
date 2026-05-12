const { Message, Conversation } = require('./message.model');

const createConversation = async (data) => Conversation.create(data);
const findConversationById = async (id) =>
  Conversation.findById(id).populate('participants', 'firstName lastName email role avatar');
const findUserConversations = async (userId) =>
  Conversation.find({ participants: userId, isActive: true })
    .populate('participants', 'firstName lastName email role avatar')
    .sort({ updatedAt: -1 });
const findConversationByParticipants = async (participants, farmId) =>
  Conversation.findOne({ participants: { $all: participants, $size: participants.length }, farmId });
const updateConversationLastMessage = async (conversationId, lastMessage) =>
  Conversation.findByIdAndUpdate(conversationId, { lastMessage }, { new: true });

const createMessage = async (data) => Message.create(data);
const findMessagesByConversation = async (conversationId, options = {}) => {
  const { page = 1, limit = 50 } = options;
  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    Message.find({ conversationId }).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('senderId', 'firstName lastName email role avatar'),
    Message.countDocuments({ conversationId }),
  ]);
  return { messages: messages.reverse(), total, page, totalPages: Math.ceil(total / limit) };
};
const markMessagesAsRead = async (conversationId, userId) =>
  Message.updateMany(
    { conversationId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } },
  );
const countUnreadMessages = async (userId) => {
  const conversations = await Conversation.find({ participants: userId });
  const ids = conversations.map((c) => c._id);
  return Message.countDocuments({ conversationId: { $in: ids }, readBy: { $ne: userId }, senderId: { $ne: userId } });
};

module.exports = {
  createConversation, findConversationById, findUserConversations, findConversationByParticipants,
  updateConversationLastMessage, createMessage, findMessagesByConversation, markMessagesAsRead, countUnreadMessages,
};
