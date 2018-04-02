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
    if(message.content.startsWith("#echo")){
      say = message.content.substring(5,message.length);
      message.channel.send(say);
      message.delete()
        .catch(console.error);
    }
  }
}