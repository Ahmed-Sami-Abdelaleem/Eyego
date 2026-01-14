//mail-service\src\services\kafkaService.js

const { consumer } = require('../config/kafka');
const emailService = require('./emailService');

class KafkaService {
  async subscribeToUserRegistration() {
    try {
      await consumer.subscribe({ 
        topic: 'user-registered', 
        fromBeginning: true 
      });
      console.log('Subscribed to user-registered topic');
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  async startConsuming() {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const userData = JSON.parse(message.value.toString());
          console.log(`Received event from topic "${topic}":`, {
            userId: userData.userId,
            email: userData.email
          });

          if (topic === 'user-registered') {
            await this.handleUserRegistration(userData);
          }
        } catch (error) {
          console.error('Error processing Kafka message:', error);
          console.error('Failed message:', message.value.toString());
        }
      }
    });
  }

  async handleUserRegistration(userData) {
    try {
      console.log(`Processing user registration for: ${userData.email}`);
      const result = await emailService.sendWelcomeEmail(userData);
      
      if (result.success) {
        console.log(`✓ Successfully processed welcome email for: ${userData.email}`);
      } else {
        console.error(`✗ Failed to send welcome email for: ${userData.email}`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error handling user registration for ${userData.email}:`, error);
      throw error;
    }
  }

  async initialize() {
    try {
      await this.subscribeToUserRegistration();
      await this.startConsuming();
      console.log('Kafka consumer initialized and running');
    } catch (error) {
      console.error('Failed to initialize Kafka consumer:', error);
      throw error;
    }
  }
}

module.exports = new KafkaService();