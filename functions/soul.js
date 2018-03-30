var Chance = require('chance'),
    chance = new Chance(),
	glob = require('glob'),
	fs = require('fs'),
	beautify = require('js-beautify').js_beautify;

module.exports = {
  command: {
    "name": "Edit the Soul",
    "desc": "Do bots have electric souls?",
	"priority" : 100,
    "prompts": [
      '#soul'
    ],
    "role": "All",
    "channels": [
      "Private"
    ]
  },
  execute: function(bot, args, message) {
    if (args == "") {
      glob('./soul/**/*.json', function(err, files) {
        message.reply("Here are all the available pieces of my soul... (please don't hurt them)\n```\n" + files.join("\n").replace(/\.\/soul\//g, "").replace(/\.json/g, "") + "```");
	  });
	}
	else {
      args = args.split(" ");

	  var file = args.shift(),
	      path = "./soul/" + file + ".json";

	  if (fs.existsSync(path)) {
		var raw = fs.readFileSync(path, 'utf8'),
	      json = JSON.parse(raw),
		  isArray = Array.isArray(json),
		  output = "",
		  availableCommands;

        if (args.length == 0) {
          if (isArray) {
            availableCommands = "  ``#soul " + file + " add <text>``\n  ``#soul " + file + " update <#> <text>``\n  ``#soul " + file + " remove <#>``";
		  }
		  else {
            availableCommands = "  *If there is both a key and a #*\n   ``#soul " + file + " add <key> <text>``\n  ``#soul " + file + " update <key> <#> <text>``\n  ``#soul " + file + " remove <key> <#>``\n";
			availableCommands += "  *If there is only a key*\n   ``#soul " + file + " update <key> <text>``";
		  }

          message.reply("Here is the current contents of my " + file + " soul.  Available commands:\n" + availableCommands);

		  for (var key in json) {
		    if (Array.isArray(json[key])) {
              for (var i = 0, len = json[key].length; i < len; i++) {
                output += "\n";
			    output += "key: " + key + ", #: " + i + "\n  ";
			    output += json[key][i];
                output += "\n";
              }
			}
			else {
              output += "\n";
              output += (isArray ? "#: " : "key: ") + key + "\n  ";
              output += json[key];
              output += "\n";
			}

			if (output.length >= 1500) {
              message.reply("```" + output + "```");
			  output = "";
			}
		  }

          if (output.length > 0) {
		    message.reply("```" + output + "```");
		  }
		}
		else {
		  var action = args.shift();

		  bot.soul(file);

		  switch (action) {
		    case 'add':
			  if (isArray) {
			    var value = args.join(' ');

			    bot.cache[file].push(value);
			  }
			  else {
                var key = args.shift(),
				    value = args.join(' ');

				if (bot.soul(file)[key] && Array.isArray(bot.soul(file)[key])) {
				  bot.cache[file][key].push(value);
				}
				else {
				  bot.cache[file][key] = [value];
				}
			  }
			  break;
			case 'update':
			  if (isArray) {
                var key = args.shift(),
				    value = args.join(' ');

				if (bot.cache[file][key]) {
                  bot.cache[file][key] = value;
				}
				else {
				  output = key + " doesn't appear to be a valid piece of my " + file + " soul.";
				}
			  }
			  else {
                var key = args.shift();

				if (bot.soul(file)[key]) {
				  if (Array.isArray(bot.soul(file)[key])) {
				    var index = args.shift(),
					    value = args.join(' ');

					if (bot.soul(file)[key][index]) {
					  bot.cache[file][key][index] = value;
					}
					else {
                      output = key + " #" + index + " doesn't appear to be a valid piece of my " + file + "soul.";
					}
				  }
				  else {
				    var value = args.join(' ');

					bot.cache[file][key] = value;
				  }
				}
				else {
                  output = key + "doesn't appear to be a valid piece of my " + file + " soul.";
				}
			  }
			  break;
			case 'remove':
			  break;
			default:
			  output = "I don't know how to " + action + " a piece of my soul!";
		  }

		  if (output == "") {
		    bot.helpers.updateSoul(file);
			message.reply('Okay!');
		  }
		  else {
		    message.reply(output);
		  }
		}
	 }
		else {
		  message.reply("Sorry, but that doesn't appear to be an existing piece of my soul ;~;");
	  }
	}
  }
}
