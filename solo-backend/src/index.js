'use strict';

module.exports = {
  register({ strapi }) {
    strapi.contentType('plugin::users-permissions.user').attributes.xp = {
      type: 'integer',
      default: 0,
    };
  },

  async bootstrap({ strapi }) {

    const existingCourses = await strapi.db.query('api::course.course').count();

    if (existingCourses === 0) {
      console.log('Database is empty. Initiating automated seeding sequence...');

      try {

        const expertRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });

        const expert = await strapi.db.query('plugin::users-permissions.user').create({
          data: {
            username: 'DrHany_Admin',
            email: 'hany@solo.edu',
            password: 'SecurePassword123!',
            role: expertRole.id,
            confirmed: true,
            provider: 'local'
          }
        });

        const student = await strapi.db.query('plugin::users-permissions.user').create({
          data: {
            username: '0xFl45h',
            email: 'student@solo.edu',
            password: 'SecurePassword123!',
            role: expertRole.id,
            confirmed: true,
            provider: 'local'
          }
        });


        const course1 = await strapi.db.query('api::course.course').create({
          data: {
            title: 'Advanced Algebraic Structures',
            description: 'An in-depth analysis of primary decomposition and uniqueness theorems.',
            category: 'Mathematics',
            instructorName: 'DrHany_Admin',
            publishedAt: new Date()
          }
        });

        const course2 = await strapi.db.query('api::course.course').create({
          data: {
            title: 'Low-Level Reverse Engineering',
            description: 'Disassembling functions and analyzing stack frame operations using GDB.',
            category: 'Cybersecurity',
            instructorName: 'DrHany_Admin',
            publishedAt: new Date()
          }
        });


        const mod1 = await strapi.db.query('api::module.module').create({
          data: {
            title: 'Primary Ideals in Commutative Rings',
            content_type: 'text',
            content: 'Detailed documentation regarding Chapter 2, Section 3 of the theorem.',
            course: course1.id,
            publishedAt: new Date()
          }
        });

        const mod2 = await strapi.db.query('api::module.module').create({
          data: {
            title: 'Path Traversal & IDOR Identification',
            content_type: 'video',
            content: 'Video walkthrough of live CTF environment exploitation.',
            course: course2.id,
            publishedAt: new Date()
          }
        });


        const enrollment = await strapi.db.query('api::enrollment.enrollment').create({
          data: {
            enrollment_date: new Date().toISOString(),
            status: 'active',
            user: student.id,
            course: course2.id,
            publishedAt: new Date()
          }
        });


        await strapi.db.query('api::progress-tracking.progress-tracking').create({
          data: {
            status: 'in_progress',
            score: 0,
            time_spent: 120,
            user: student.id,
            module: mod2.id,
            publishedAt: new Date()
          }
        });

        console.log('Seeding complete. RBAC and relational data structures are established.');
      } catch (error) {
        console.error('Seeding failed:', error);
      }
    }
  },
};
