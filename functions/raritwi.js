var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "RARI",
    "desc": "TWI!",
    "prompts": [
      'raritwi'
    ],
    "noMention": false,
    "noMentionLikelihood": 0,
    "role": "All",
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.send(chance.pickone(bot.soul("raritwi")));
  }
}