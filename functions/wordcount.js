module.exports = {
  command: {
    "name": "#wordcount",
    "desc": "I can save your word counts!",
    "group": "General",
    "prompts": [
      '#wordcount'
    ],
    "role": "All",
    "noMention": true,
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.send("Not yet implemented! (WIP)");
  }
}