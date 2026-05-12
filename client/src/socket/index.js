import { io } from 'socket.io-client';

let messagingSocket = null;
let alertSocket = null;

export const connectMessagingSocket = (token) => {
  if (messagingSocket?.connected) return messagingSocket;
  messagingSocket = io('/vet-messaging', {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  messagingSocket.on('connect', () => console.log('[Socket] Messaging connected'));
  messagingSocket.on('disconnect', () => console.log('[Socket] Messaging disconnected'));
  messagingSocket.on('connect_error', (err) => console.error('[Socket] Messaging error:', err.message));
  return messagingSocket;
};

export const connectAlertSocket = (token) => {
  if (alertSocket?.connected) return alertSocket;
  alertSocket = io('/alerts', {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  alertSocket.on('connect', () => console.log('[Socket] Alerts connected'));
  alertSocket.on('disconnect', () => console.log('[Socket] Alerts disconnected'));
  return alertSocket;
};

export const disconnectSockets = () => {
  messagingSocket?.disconnect();
  alertSocket?.disconnect();
  messagingSocket = null;
  alertSocket = null;
};

export const getMessagingSocket = () => messagingSocket;
export const getAlertSocket = () => alertSocket;
