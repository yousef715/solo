'use strict';

const nodemailer = require('nodemailer');

module.exports = {
  async testEmail(ctx) {
    try {
      const port = parseInt(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.verify();
      ctx.send({ 
        success: true, 
        message: 'SMTP is working!',
        config: {
          host: process.env.SMTP_HOST,
          port: port,
          user: process.env.SMTP_USERNAME,
        }
      });
    } catch (err) {
      ctx.send({ 
        success: false, 
        error: err.message, 
        stack: err.stack,
        config: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          user: process.env.SMTP_USERNAME,
        }
      });
    }
  }
};
