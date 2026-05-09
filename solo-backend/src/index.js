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

      // Enable email confirmation automatically
      try {
        const pluginStore = strapi.store({
          environment: '',
          type: 'plugin',
          name: 'users-permissions',
        });
        
        const advanced = await pluginStore.get({ key: 'advanced' });
        
        if (advanced) {
          advanced.email_confirmation = true;
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
          advanced.email_confirmation_redirection = `${frontendUrl}/login?confirmed=true`;
          await pluginStore.set({ key: 'advanced', value: advanced });
          console.log('Email confirmation is now forcibly enabled. Advanced settings:', advanced);
        } else {
          console.log('Advanced settings not found!');
        }
      } catch (error) {
        console.error('Failed to configure email confirmation:', error);
      }

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

      // Seed the requested course properly for Strapi v5 (so it shows in Admin panel)
      const courseTitle = 'Introduction to Programming';
      
      // Delete any improperly seeded ones first
      await strapi.db.query('api::course.course').deleteMany({
        where: { title: courseTitle },
      });

      // Create using Document API to generate both Draft & Published states
      await strapi.documents('api::course.course').create({
        data: {
          title: courseTitle,
          description: 'A beginner-friendly free course covering the fundamentals of programming logic and problem solving',
          category: 'Software Engineering',
          instructorName: 'Hussein Karam',
          price: 0,
        },
        status: 'published',
      });
      console.log(`Seeded course properly: ${courseTitle}`);

    } catch (err) {
      console.error('Failed to delete ghost courses:', err);
    }
  },
};
