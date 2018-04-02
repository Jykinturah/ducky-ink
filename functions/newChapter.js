module.exports = {
  command: {
    "name": "#newchapter",
    "desc": "I'll tell you about the latest chapter!",
    "prompts": [
      "#newchapter"
    ],
    "role": "admin",
    "channels": [
      "All"
    ],
    "noMention": true
  },
  execute: function(bot, args, message) {
    // let currentStoryId = 379911; // TODO: MOVE THIS INTO MONGODB OR CONFIGURABLE FILE
    // let announcementChannel = 385935248594042880; // TODO: MOVE THIS INTO CONFIGURABLE FILE
    // let authorUser = message.guild.members.get(208689647981690882);
    // let targetRole = message.guild.roles.find("name","Book Bringers");

    let newChapterSettings = bot.settings("newChapter");

    bot.helpers.getJSON({ // fetch story
        url: "https://www.fimfiction.net/api/v2/stories/" + newChapterSettings.fimficStoryID,
        headers: {
          "User-Agent": bot.config.userAgent,
          "Authorization": "Bearer " + bot.config.fimfictionAccessKey
        }
      },function(response){
        let story = response.data;
        let author = {
          name: "FiMFiction User",
          icon_url: "https://static.fimfiction.net/images/none_64.png"
        };

        for (var i = 0, len = response.included.length; i < len; i++) {
          if (response.included[i].type == "user" && response.included[i].id == story.relationships.author.data.id) {
            author.name = response.included[i].attributes.name;
            author.icon_url = response.included[i].attributes.avatar['32'];
          }
        }

        bot.helpers.getJSON({ // fetch chapters
          url: "https://www.fimfiction.net/api/v2/stories/" + newChapterSettings.fimficStoryID + "/chapters",
          headers: {
            "User-Agent": bot.config.userAgent,
            "Authorization": "Bearer " + bot.config.fimfictionAccessKey
          }
        },
        function(response){
          let chapter = response.data[response.data.length - 1];

          let publishedDate = new Date(chapter.attributes.date_published)
            let formattedDate = publishedDate.getDate() + ' ' + bot.helpers.months[publishedDate.getMonth()] + ' ' + publishedDate.getFullYear();

            let msgString = "Hi " + bot.client.guilds.get(newChapterSettings.guildID).roles.find("name",newChapterSettings.mentionRole) + "! " +
              "The newest chapter of " + story.attributes.title + " is up! " +
              "Please remember to keep all spoilers to the appropriate channel, " + 
              "and send any complaints regarding any potential " +
              "broken hearts to <@" + newChapterSettings.authorID + ">!\n\n" +
              "Thank you for your support! <3"

            if(newChapterSettings.emojiName)
              msgString += "\n" + bot.client.emojis.find("name",newChapterSettings.emojiName);

            let targetChannel = bot.client.channels.find("name",newChapterSettings.channelName);

            targetChannel.send(msgString);
            targetChannel.send("<" + chapter.meta.url + ">");
            targetChannel.send({ 
              embed: {
                color: parseInt(story.attributes.color.hex, 16),
                author: author,
                title: chapter.attributes.title,
                url: chapter.meta.url,
                thumbnail: {
                  url: story.attributes.cover_image.medium
                },
                fields: [
                  {
                    name: "Posted",
                    value: formattedDate,
                    inline: true
                  },
                  {
                    name: "Chapter Word Count",
                    value: chapter.attributes.num_words.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    inline: true
                  }
                ],
                footer: {
                  icon_url: "https://static.fimfiction.net/images/logo-2x.png",
                  text: "FiMFiction API"
                }
              }
            });
          }
        );
      }
    );
  }
}