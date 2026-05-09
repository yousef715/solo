const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'yousefmorse4@gmail.com',
    pass: 'bfggmbiabkbtdulx'
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP Connection Error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});
