var Chance = require('chance'),
  chance = new Chance();

module.exports = {
  command: {
    "name": "deviantArt Link Previews",
    "desc": "Discord and deviantArt do not always get along.  Let SoulBot preview the images for you!",
    "priority": 500,
    "noMention": true,
    "noMentionLikelihood": 100,
    "prompts": [
      /(https?:\/\/[^\s\/]*deviantart.com\/[^\s\/]+\/art\/[^\s\>]+)/gi
    ],
    "role": "All",
    "channels": [
      "All"
    ]
  },

  execute: function(bot, args, message) {
    var self = this;

    setTimeout(function() {
      if (message.embeds.length == 0) {
        var link = message.content.match(self.command.prompts[0]);

        bot.helpers.getMETA(link[0], function(meta) {
          if (meta.image) {
            message.reply(chance.pickone(bot.soul('deviantArtResponses')), 
              { embed: {
                title: meta.title,
                url: meta.url,
                description: meta.description,
                image: {url: meta.image}
              }
            });
          } else if (meta.error) {
            message.reply(meta.error);
          }
        });
      }
    }, 5000);
  }
}