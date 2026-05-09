const strapi = require('@strapi/strapi');

strapi().start().then(async (app) => {
  try {
    const users = await app.db.query('plugin::users-permissions.user').findMany();
    console.log('Current users in DB:', users.map(u => ({ id: u.id, username: u.username, email: u.email })));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
});
