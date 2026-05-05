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

      // Grant permissions for comments to the authenticated role
      const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (authenticatedRole) {
        const permissions = ['find', 'create'];
        for (const action of permissions) {
          const actionString = `api::comment.comment.${action}`;
          
          const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: { action: actionString, role: authenticatedRole.id },
          });

          if (!existingPermission) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: { action: actionString, role: authenticatedRole.id },
            });
          }
        }
      }

      // DEBUG: Grant find to public role
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      if (publicRole) {
        const actionString = `api::comment.comment.find`;
        const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: { action: actionString, role: publicRole.id },
        });
        if (!existingPermission) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: { action: actionString, role: publicRole.id },
          });
        }
      }
    } catch (err) {
      console.error('Failed to delete ghost courses:', err);
    }
  },
};
