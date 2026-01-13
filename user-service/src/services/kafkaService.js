const { producer } = require('../config/kafka');

class KafkaService {
  async publishUserRegisteredEvent(user) {
    try {
      await producer.send({
        topic: 'user-registered',
        messages: [
          {
            key: user._id.toString(),
            value: JSON.stringify({
              userId: user._id,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt
            })
          }
        ]
      });
      console.log(`User registration event published for: ${user.email}`);
      return true;
    } catch (error) {
      console.error('Kafka publish error:', error.message);
      return false;
    }
  }

  async publishEvent(topic, key, data) {
    try {
      await producer.send({
        topic,
        messages: [
          {
            key,
            value: JSON.stringify(data)
          }
        ]
      });
      console.log(`Event published to topic: ${topic}`);
      return true;
    } catch (error) {
      console.error(`Kafka publish error for topic ${topic}:`, error.message);
      return false;
    }
  }
}

module.exports = new KafkaService();