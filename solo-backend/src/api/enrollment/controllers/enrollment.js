'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::enrollment.enrollment', ({ strapi }) => ({
  
  // Override GET /enrollments
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required.');

    try {
      // BYPASS HTTP VALIDATOR: Execute raw database query
      const entries = await strapi.db.query('api::enrollment.enrollment').findMany({
        where: {
          user: user.id // Match the foreign key directly in PostgreSQL
        },
        populate: ['course'] // Perform the SQL JOIN
      });

      // Wrap in { data: ... } to match the JSON structure React expects
      return { data: entries, meta: { total: entries.length } };
    } catch (err) {
      console.error("DB Query Error:", err);
      return ctx.internalServerError("Database execution failed.");
    }
  },

  // Override POST /enrollments
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required.');

    const requestData = ctx.request.body.data || {};
    const requestedCourse = requestData.course;

    if (!requestedCourse) return ctx.badRequest('Course identifier is required.');

    try {
      // Check if the input is a pure number or an alphanumeric string
      const isLegacyId = !isNaN(requestedCourse);
      
      // Build the safe SQL WHERE clause
      const safeQuery = isLegacyId 
        ? { id: Number(requestedCourse) } 
        : { documentId: requestedCourse };

      // DEFENSE LINE 1: Verify the course actually exists (Prevents SQL Type Crashes)
      const courseExists = await strapi.db.query('api::course.course').findOne({
        where: safeQuery
      });

      if (!courseExists) {
        return ctx.badRequest(`Execution Failed: Course '${requestedCourse}' does not exist in the database.`);
      }

      // DEFENSE LINE 2: Prevent Duplicate Enrollments
      const alreadyEnrolled = await strapi.db.query('api::enrollment.enrollment').findOne({
        where: {
          user: user.id,
          course: courseExists.id 
        }
      });

      if (alreadyEnrolled) {
        return ctx.badRequest('Execution Failed: User is already enrolled in this course.');
      }

      // DEFENSE LINE 3: Safe Execution with explicit population
      const newEnrollment = await strapi.db.query('api::enrollment.enrollment').create({
        data: {
          enrollment_date: new Date().toISOString(),
          status: 'active',
          course: courseExists.id, // Safely link the verified Integer ID
          user: user.id,           // Safely link the Token Integer ID
          publishedAt: new Date()
        },
        // Tell the database to perform the JOINs before returning the object
        populate: {
          course: {
            populate: ['modules'] // Deeply populate the modules attached to the course
          }
        }
      });

      return { data: newEnrollment };
    } catch (err) {
      console.error("DB Error:", err);
      return ctx.internalServerError("Database execution failed.");
    }
  }
}));