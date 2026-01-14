//mail-service\src\config\emails.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const verifyEmailConfig = () => {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set in environment variables');
    process.exit(1);
  }
  
  if (!process.env.RESEND_FROM_EMAIL) {
    console.error('RESEND_FROM_EMAIL is not set in environment variables');
    process.exit(1);
  }
  
  console.log('Resend email service is configured and ready');
};

module.exports = {
  resend,
  verifyEmailConfig
};