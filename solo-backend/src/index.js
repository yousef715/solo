'use strict';

module.exports = {
  register({ strapi }) {
    strapi.contentType('plugin::users-permissions.user').attributes.xp = {
      type: 'integer',
      default: 0,
    };
  },

  async bootstrap({ strapi }) {
    // Bootstrap logic removed to prevent auto-seeding of courses
    // which overrides the user's manual deletions.
  },
};
