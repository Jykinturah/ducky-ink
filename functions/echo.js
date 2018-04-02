module.exports = {
  command: {
    "name": "#echo",
    "desc": "I will echo what you say!",
    "prompts": [
      '#echo'
    ],
    "role": "admin",
    "noMention": true,
    "channels": [
      "All"
    ]
  },
  execute: function(bot, args, message) {
    if (message.content.startsWith("#echo")) {
      let targetChannel = message.guild.channels.get(message.content.substring(5 + 1 + 2, 5 + 1 + 2 + 18));
      console.log(message.content.substring(5 + 1 + 2, 5 + 1 + 2 + 18));
      if (targetChannel) {
        targetChannel.send(message.content.substring(5 + 1 + 21)).catch(console.error);
      } else {
        message.channel.send(message.content.substring(5)).catch(console.error);
        message.delete().catch(console.error);
      }
    }
  }
}