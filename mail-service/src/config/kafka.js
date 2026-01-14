//mail-service\src\config\kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'mail-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ 
  groupId: 'mail-service-group',
  retry: {
    retries: 5,
    initialRetryTime: 300
  }
});

const connectConsumer = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await consumer.connect();
      console.log('Kafka Consumer connected');
      return;
    } catch (error) {
      retries--;
      console.error(`Kafka connection failed. Retries left: ${retries}`, error.message);
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('Kafka Consumer disconnected');
  } catch (error) {
    console.error('Kafka disconnection error:', error);
  }
};

module.exports = {
  kafka,
  consumer,
  connectConsumer,
  disconnectConsumer
};