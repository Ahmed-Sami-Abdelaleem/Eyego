const userService = require('../services/userService');
const kafkaService = require('../services/kafkaService');

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'All fields are required',
          fields: { name, email, password: password ? 'provided' : 'missing' }
        });
      }

      const user = await userService.createUser({ name, email, password });
      await kafkaService.publishUserRegisteredEvent(user);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'User already exists') {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async healthCheck(req, res) {
    res.json({ 
      status: 'UP', 
      service: 'user-service',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new UserController();