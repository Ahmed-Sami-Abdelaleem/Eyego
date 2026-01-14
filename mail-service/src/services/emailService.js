//mail-service\src\services\emailService.js

const { resend } = require('../config/emails');
const { generateWelcomeEmail, generateEmailSubject } = require('../templates/welcomeEmail');

class EmailService {
  async sendWelcomeEmail(userData) {
    try {
      const result = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [userData.email],
        subject: 'hello world',
        html: '<p>it works!</p>',
      });

      console.log(`Welcome email sent to ${userData.email}: ${result.id}`);
      return {
        success: true,
        messageId: result.id,
        email: userData.email
      };
    } catch (error) {
      console.error(`Error sending email to ${userData.email}:`, error);
      return {
        success: false,
        error: error.message,
        email: userData.email
      };
    }
  }

  async sendEmail(to, subject, htmlContent, from = null) {
    try {
      const result = await resend.emails.send({
        from: from || process.env.RESEND_FROM_EMAIL,
        to,
        subject,
        html: htmlContent
      });

      console.log(`Email sent to ${to}: ${result.id}`);
      return {
        success: true,
        messageId: result.id,
        email: to
      };
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      return {
        success: false,
        error: error.message,
        email: to
      };
    }
  }
}

module.exports = new EmailService();