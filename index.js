const Discord = require('discord.js');
const db = require('old-wio.db');
const fs = require(`fs`);
const client = new Discord.Client();

client.config = require('./config/config.json');
client.emotes = require('./config/emotes.json');
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.aliases = new Discord.Collection();
client.snipes = new Map();
client.on('messageDelete', function(message, channel){
client.snipes.set(message.channel.id,{
    content:message.content,
    author:message.author.id,
    authorimg:message.author.avatarURL(),
    image:message.attachments.first() ? message.attachments.first().proxyURL : null,
    channelid:message.channel.id
})
});

["aliases", "commands"].forEach(cmd => client[cmd] = new Discord.Collection());
["console", "command", "event"].forEach(events => require(`./handler/${events}`)(client));
client.categories = fs.readdirSync('./commands/')

const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: client.config.botsCanWin,
        embedColor: client.config.embedColor,
        embedColorEnd: client.config.embedColorEnd,
        reaction: client.config.reaction
    }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    if (member.id !== client.user.id){
        console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
    }
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    if (member.id !== client.user.id){
        console.log(`${member.user.tag} left giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
    }
});

client.login(client.config.token);