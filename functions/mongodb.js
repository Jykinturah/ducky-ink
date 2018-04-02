module.exports = {
  command: {
    "name": "Edit database config",
    "desc": "How do I remember things?",
    "priority": 105,
    "prompts": [
      '#db'
    ],
    "role": "admin",
    "channels": [
      "Private"
    ]
  },
  execute: function(bot, args, message) {
    message.channel.send("Not yet implemented! (WIP)");
  }
}