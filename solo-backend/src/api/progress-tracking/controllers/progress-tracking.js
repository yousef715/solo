'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::progress-tracking.progress-tracking', ({ strapi }) => ({
  
  // Override GET /progress-trackings
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required.');

    try {
      // BYPASS HTTP VALIDATOR: Execute raw database query
      const entries = await strapi.db.query('api::progress-tracking.progress-tracking').findMany({
        where: { user: user.id }, // RBAC Enforcement
        populate: ['module']
      });

      return { data: entries, meta: { total: entries.length } };
    } catch (err) {
      console.error("DB Query Error:", err);
      return ctx.internalServerError("Database execution failed.");
    }
  },

  // Override POST /progress-trackings
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required.');

    const requestData = ctx.request.body.data || {};
    const requestedModule = requestData.module;

    if (!requestedModule) return ctx.badRequest('Module identifier is required.');

    try {
      const isLegacyId = !isNaN(requestedModule);
      const safeQuery = isLegacyId ? { id: Number(requestedModule) } : { documentId: requestedModule };

      // DEFENSE LINE 1: Verify the module actually exists
      const moduleExists = await strapi.db.query('api::module.module').findOne({
        where: safeQuery
      });

      if (!moduleExists) return ctx.badRequest(`Module '${requestedModule}' does not exist.`);

      // DEFENSE LINE 2: Prevent Duplicate Tracking
      const alreadyTracking = await strapi.db.query('api::progress-tracking.progress-tracking').findOne({
        where: { user: user.id, module: moduleExists.id }
      });

      if (alreadyTracking) return ctx.badRequest('User has already started this module.');

      // DEFENSE LINE 3: Safe Execution
      const newProgress = await strapi.db.query('api::progress-tracking.progress-tracking').create({
        data: {
          status: requestData.status || 'in_progress',
          score: requestData.score || 0,
          time_spent: requestData.time_spent || 0,
          module: moduleExists.id, // Link verified integer ID
          user: user.id,           // Link token integer ID
          publishedAt: new Date()
        },
        populate: ['module']
      });

      return { data: newProgress };
    } catch (err) {
      console.error("DB Insert Error:", err);
      return ctx.internalServerError("Database insert failed.");
    }
  },

  // Override PUT /progress-trackings/:id
  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Authentication required.');

    const progressId = ctx.params.id; // From the URL
    const requestData = ctx.request.body.data || {};

    try {
        const isLegacyId = !isNaN(progressId);
        const safeQuery = isLegacyId ? { id: Number(progressId) } : { documentId: progressId };
        
        // RBAC ENFORCEMENT: Find the existing record AND ensure the current user owns it
        const existingRecord = await strapi.db.query('api::progress-tracking.progress-tracking').findOne({
            where: {
                ...safeQuery,
                user: user.id 
            }
        });

        if (!existingRecord) {
            return ctx.unauthorized('You cannot modify this record, or it does not exist.');
        }

        // Execute the safe update
        const updatedProgress = await strapi.db.query('api::progress-tracking.progress-tracking').update({
            where: { id: existingRecord.id },
            data: {
                status: requestData.status !== undefined ? requestData.status : existingRecord.status,
                score: requestData.score !== undefined ? requestData.score : existingRecord.score,
                time_spent: requestData.time_spent !== undefined ? requestData.time_spent : existingRecord.time_spent,
            },
            populate: ['module']
        });

        return { data: updatedProgress };
    } catch (err) {
        console.error("DB Update Error:", err);
        return ctx.internalServerError("Database update failed.");
    }
  }
}));