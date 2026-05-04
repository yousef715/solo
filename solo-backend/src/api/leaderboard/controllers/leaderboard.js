'use strict';

module.exports = {
  async getLeaderboard(ctx) {
    try {
      const users = await strapi.db.query('plugin::users-permissions.user').findMany({
        select: ['id', 'username', 'xp']
      });
      
      const validUsers = users.filter(u => u.username && u.username.trim() !== '');
      validUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      
      return validUsers.slice(0, 10);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async addXp(ctx) {
    try {
      const { userId, xp } = ctx.request.body;
      if (!userId) {
        return ctx.badRequest('userId is required');
      }

      const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { xp: xp }
      });
      
      return updatedUser;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async updateGoal(ctx) {
    try {
      const { userId, goal } = ctx.request.body;
      if (!userId) {
        return ctx.badRequest('userId is required');
      }

      const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { daily_goal: goal }
      });
      
      return updatedUser;
    } catch (err) {
      ctx.throw(500, err);
    }
  }
};
