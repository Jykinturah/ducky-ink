var glob = require('glob'),
  fs = require('fs');

module.exports = {
  command: {
    "name": "Edit Settings",
    "desc": "Settings to allow for persistent, changeable... things!",
    "priority": 110,
    "prompts": [
      '#settings'
    ],
    "role": "admin",
    "channels": [
      "Private"
    ]
  },
  execute: function(bot, args, message) {
    if (args == "") {
      glob('./settings/**/*.json', function(err, files) {
        message.reply("Here are all of the settings I'm remembering for you!\n```\n" + files.join("\n").replace(/\.\/settings\//g, "").replace(/\.json/g, "") + "```");
      });
    } else {
      args = args.split(" ");

      var file = args.shift(),
        path = "./settings/" + file + ".json";

      if (fs.existsSync(path)) {
        var raw = fs.readFileSync(path, 'utf8'),
          json = JSON.parse(raw),
          output = "";

        if (args.length == 0) {
          message.reply("Here is the current contents of my `" + file + "` settings.  Available commands:\n" +
            "`#settings " + file + " modify <option> <value>`");

          for (var key in json) {
            output += "\noption: " + key + "\n  value: " + json[key];
            if (output.length >= 1500) {
              message.reply("```" + output + "```");
              output = "";
            }
          }

          if (output.length > 0) {
            message.reply("```" + output + "```");
          }
        } else {
          let action = args.shift();

          bot.settings(file);

          if (action == 'modify') {
            let key = args.shift();
            if (bot.settings(file)[key]) {
              let value = args.join(' ');
              bot.cache[file][key] = value;
            } else {
              output = key + "doesn't appear to be a valid piece of my " + file + " settings.";
            }
          } else {
            output = "I don't know how to " + action + " settings!";
          }

          if (output == "") {
            bot.helpers.updateSettings(file);
            message.reply('Okay!');
          } else {
            message.reply(output);
          }
        }
      } else {
        message.reply("Sorry, that doesn't seem to be a setting!");
      }
    }
  }
}