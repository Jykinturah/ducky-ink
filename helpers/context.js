var moment = require('moment-timezone');

module.exports = function(bot) {
  return {
    setContext: function(userId, command, state) {
      var context = bot.memory.getItem('context') || {};

      context[userId] = {
        'command': command,
        'state': state,
        'expires': moment().add('1', 'hour').valueOf()
      };

      bot.memory.setItem('context', context);
    },

    clearContext: function(userId) {
      var context = bot.memory.getItem('context') || {};

      context[userId] = null;

      bot.memory.setItemSync('context', context);
    },

    getContext: function(userId) {
      var context = bot.memory.getItem('context') || {};

      if (context[userId] && context[userId].expires && context[userId].expires > moment().valueOf()) {
        return context[userId];
      } else {
        return false;
      }
    }
  }
}