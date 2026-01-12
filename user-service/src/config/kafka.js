const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();
const admin = kafka.admin();

const connectProducer = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await producer.connect();
      console.log('Kafka Producer connected');
      return;
    } catch (error) {
      retries--;
      console.error(`Kafka connection failed. Retries left: ${retries}`, error.message);
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log('Kafka Producer disconnected');
  } catch (error) {
    console.error('Kafka disconnection error:', error);
  }
};

const startHealthCheck = () => {
  setInterval(async () => {
    try {
      await admin.connect();
      await admin.listTopics();
      await admin.disconnect();
    } catch (error) {
      console.error('Kafka health check failed:', error.message);
    }
  }, 30000);
};

module.exports = {
  kafka,
  producer,
  connectProducer,
  disconnectProducer,
  startHealthCheck
};