//mail-service/index.js

const app = require('./src/app');
const { verifyEmailConfig } = require('./src/config/emails');
const { connectConsumer, disconnectConsumer } = require('./src/config/kafka');
const kafkaService = require('./src/services/kafkaService');

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    verifyEmailConfig();
    await connectConsumer();
    await kafkaService.initialize();

    app.listen(PORT, () => {
      console.log(`Mail Service running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    await disconnectConsumer();
    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

startServer();