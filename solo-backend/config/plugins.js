module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.ethereal.email'),
        port: env.int('SMTP_PORT', 587),
        secure: env.int('SMTP_PORT', 587) === 465,
        family: 4,
        auth: {
          user: env('SMTP_USERNAME', 'n54zvqn44hyzu47u@ethereal.email'),
          pass: env('SMTP_PASSWORD', 'EFQQjPdgNbNbwd5Qju'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_USERNAME', 'no-reply@solo-learning.com'),
        defaultReplyTo: env('SMTP_USERNAME', 'no-reply@solo-learning.com'),
      },
    },
  },
});
