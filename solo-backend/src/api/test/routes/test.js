module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/test-email',
      handler: 'test.testEmail',
      config: {
        auth: false,
      },
    },
  ],
};
