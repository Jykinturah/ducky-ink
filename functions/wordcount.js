module.exports = {
  command: {
    "name": "Word Counts",
    "desc": "I can save your wordcounts!",
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