const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const setupSocket = require('./socket');
const env = require('./config/env');

const start = async () => {
  try {
    await connectDB();

    const httpServer = http.createServer(app);
    const socketIO = setupSocket(httpServer);

    httpServer.listen(env.port, '0.0.0.0', () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
      console.log(`API: http://localhost:${env.port}/api/health`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
