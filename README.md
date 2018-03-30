# Ducky Ink - A Discord Bot based on a SoulBOT fork

Ducky Ink acts as a utility bot for the Enchanted Library Discord server. She is forked from [ktrzonkowski's](https://github.com/ktrzonkowski) [SoulBot](https://github.com/ktrzonkowski/soulbot) and uses the same dependencies. Most of Ducky Ink's code was contributed by ktrzonkowski.

## Installation

This bot is specifically made for a specific discord server, but if for whatever reason you wish to run your own, here are the instructions!

Ducky Ink is built using [discord.js](https://github.com/hydrabolt/discord.js/) and, therefore, requires **node.js 8.0.0 or newer**.  You will also need npm to install dependencies as well as utilize the built-in shortcuts.

After getting node and npm on your server, you'll want to download or clone the master branch of this repo.  There is a little setup required before your Discord bot will work:

- If you haven't already, then create your bot.  You can find instructions for this here: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
- If you haven't already, run `npm install` while in the root folder of this repo
- Copy `config.json` from the `samples/data` folder to the root folder and:
  - Update the `clientId` with the Token from your bot's page
  - *Optional but Recommended*: Update the `mainChat` with the name of your "main" chatroom (e.g. general)
- Run `npm start`, `node app.js`, or `pm2 app.js`, (etc.) and you should be good to go!