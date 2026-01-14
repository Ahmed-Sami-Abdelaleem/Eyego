//mail-service\src\controllers\healthController.js
class HealthController {
  async checkHealth(req, res) {
    res.json({ 
      status: 'UP', 
      service: 'mail-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}

module.exports = new HealthController();