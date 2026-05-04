'use strict';

module.exports = {
  register({ strapi }) {
    strapi.contentType('plugin::users-permissions.user').attributes.xp = {
      type: 'integer',
      default: 0,
    };
    strapi.contentType('plugin::users-permissions.user').attributes.daily_goal = {
      type: 'integer',
      default: 0,
    };
  },

  async bootstrap({ strapi }) {
    try {
      await strapi.db.query('api::course.course').deleteMany({
        where: {
          title: {
            $in: ['Advanced Algebraic Structures', 'Low-Level Reverse Engineering']
          }
        }
      });
      await strapi.db.query('api::module.module').deleteMany({
        where: {
          title: {
            $in: ['Primary Ideals in Commutative Rings', 'Path Traversal & IDOR Identification']
          }
        }
      });
      console.log('Ghost courses and modules deleted!');
    } catch (err) {
      console.error('Failed to delete ghost courses:', err);
    }
  },
};
