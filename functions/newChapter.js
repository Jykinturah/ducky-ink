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

    if(args == "") {
      let storyTitles = Object.keys(newChapterSettings);
      let rspStry = "The stories I have hardcoded currently are:\n```\n";
      storyTitles.forEach((stryItem) => {
        if(stryItem != "TEST_OBJECT_FIELD")
          rspStry += stryItem + " (" + newChapterSettings[stryItem].fimficStoryID + ")\n";
      });
      rspStry += "```";
      message.channel.send(rspStry).catch((err) => {console.log(err);});
      return;
    }

    args = args.split(" ");

    let storyTag = args.shift();
    if(storyTag == "TEST_OBJECT_FIELD") {message.channel.send("Couldn't find that story, sorry!").catch((err) => {console.log(err);});return;}
    let storyObject = newChapterSettings[storyTag];
    if(!storyObject){message.channel.send("Couldn't find that story, sorry!").catch((err) => {console.log(err);});return;}

    if(args.length < 1){
      this.sendStory(bot,args,message,storyObject);
      return;
    } else {
      let option = args.shift();
      if(option === "test"){
        let testMsg = "Testing! Normally I would use:\n";
        testMsg += "Channel Name: `" + storyObject.channelName + "`\n";
        testMsg += "Mention Role: `" + storyObject.mentionRole + "`";
        message.channel.send(testMsg).catch((err) => {console.log(err);});
        storyObject.authorID = newChapterSettings["TEST_OBJECT_FIELD"].authorID;
        storyObject.channelName = newChapterSettings["TEST_OBJECT_FIELD"].channelName;
        storyObject.mentionRole = newChapterSettings["TEST_OBJECT_FIELD"].mentionRole;
        this.sendStory(bot,args,message,storyObject);
      }
      if(option === "set"){
        bot.settings("newChapter");
        let setOp = args.shift();
        if(!setOp || ( setOp != "msg" && setOp != "role" && setOp != "channel")){
          message.channel.send("Please specify `msg`, `role`, or `channel`!\n Ex: `newchapter <story> set msg <message>`").catch((err) => {console.log(err);});
          return;
        }else{
          args = args.join(" ");
          if(setOp === "msg"){
            storyObject.msgstr = args;
          } else if (setOp === "role") {
            storyObject.mentionRole = args;
          } else if (setOp === "channel") {
            storyObject.channelName = args;
          }
          newChapterSettings[storyTag] = storyObject;
          bot.cache["newChapter"] = newChapterSettings;
          bot.helpers.updateSettings("newChapter");
          message.channel.send("Set!\n```\n" + setOp + ": " + args + "\n```").catch((err) => {console.log(err);});
        }
      }
    }
  },
  sendStory: function(bot, args, message, storyObject){
    bot.helpers.getJSON({ // fetch story
      url: "https://www.fimfiction.net/api/v2/stories/" + storyObject.fimficStoryID,
      headers: {
        "User-Agent": bot.config.userAgent,
        "Authorization": "Bearer " + bot.config.fimfictionAccessKey
      }
    }, function(response) {
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
          url: "https://www.fimfiction.net/api/v2/stories/" + storyObject.fimficStoryID + "/chapters",
          headers: {
            "User-Agent": bot.config.userAgent,
            "Authorization": "Bearer " + bot.config.fimfictionAccessKey
          }
        },
        function(response) {
          let chapter = response.data[response.data.length - 1];

          let publishedDate = new Date(chapter.attributes.date_published)
          let formattedDate = publishedDate.getDate() + ' ' + bot.helpers.months[publishedDate.getMonth()] + ' ' + publishedDate.getFullYear();

          let mentionRoleStr = bot.client.guilds.get(storyObject.guildID).roles.find("name", storyObject.mentionRole);
          let titleStr = "_" + story.attributes.title + "_";
          let authorStr = "<@" + storyObject.authorID + ">";

          let msgString = storyObject.msgstr.replace("{mentionrole}",mentionRoleStr).replace("{title}",titleStr).replace("{author}",authorStr);

          /*
          "Hi {mentionrole}! The newest chapter of {title} is up! Please remember to keep all spoilers to the appropriate channel, and send any complaints regarding any potential broken hearts to {author}!

          Thank you for your support! <3"

          {mentionrole} = bot.client.guilds.get(storyObject.guildID).roles.find("name", storyObject.mentionRole)
          {title} = story.attributes.title
          {author} =  "<@" + storyObject.authorID + ">"
          */

          if (storyObject.emojiName)
            msgString += "\n" + bot.client.emojis.find("name", storyObject.emojiName);

          let targetChannel = bot.client.channels.find("name", storyObject.channelName);

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
              fields: [{
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
    });
  }
}