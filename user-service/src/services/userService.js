const bcrypt = require('bcryptjs');
const User = require('../models/User');

class UserService {
  async createUser(userData) {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    return user;
  }

  async getAllUsers() {
    const users = await User.find().select('-password');
    return users;
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email }).select('-password');
    return user;
  }
}

module.exports = new UserService();