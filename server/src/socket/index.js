const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.socketCorsOrigin,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const authMiddleware = (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, env.jwt.accessSecret);
      socket.user = decoded;
      next();
    } catch {
      return next(new Error('Invalid token'));
    }
  };

  const messagingNamespace = io.of('/vet-messaging');
  messagingNamespace.use(authMiddleware);
  messagingNamespace.on('connection', (socket) => {
    console.log(`[Messaging] User ${socket.user.id} connected`);

    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('send-message', async (data) => {
      const { conversationId, content } = data;
      try {
        const { sendMessage } = require('../modules/messaging/messaging.service');
        const result = await sendMessage(conversationId, socket.user.id, content);
        messagingNamespace.to(`conversation:${conversationId}`).emit('new-message', result.message);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId: socket.user.id,
        isTyping,
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Messaging] User ${socket.user.id} disconnected`);
    });
  });

  const alertNamespace = io.of('/alerts');
  alertNamespace.use(authMiddleware);
  alertNamespace.on('connection', (socket) => {
    console.log(`[Alerts] User ${socket.user.id} connected`);

    socket.on('subscribe-farm', (farmId) => {
      socket.join(`farm:${farmId}`);
    });

    socket.on('unsubscribe-farm', (farmId) => {
      socket.leave(`farm:${farmId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Alerts] User ${socket.user.id} disconnected`);
    });
  });

  const broadcastAlert = async (farmId, alert) => {
    alertNamespace.to(`farm:${farmId}`).emit('new-alert', alert);
  };

  return { io, messagingNamespace, alertNamespace, broadcastAlert };
};

module.exports = setupSocket;
