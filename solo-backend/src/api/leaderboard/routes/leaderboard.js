module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/leaderboard',
      handler: 'leaderboard.getLeaderboard',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/leaderboard/xp',
      handler: 'leaderboard.addXp',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/user/goal',
      handler: 'leaderboard.updateGoal',
      config: {
        auth: false
      }
    }
  ]
};
