const db = require('old-wio.db');
const { PREFIX } = require('../../config/config.json');
const config = require('../../config/config.json');
const Discord = require('discord.js');
const ms = require('ms');
const talkedRecently = new Set();  

module.exports = async (client, message) => {
    try {
        if (message.author.bot || message.channel.type === "dm") return;

        let prefix;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);

        if (fetched === null) {
            prefix = PREFIX
        } else {
            prefix = fetched
        }

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();

        if (!message.content.startsWith(prefix)) return;

        var commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
        if (commandfile) {
if (commandfile.config.cooldown) {
    if (talkedRecently.has(message.author.id)) {
        const embed = new Discord.MessageEmbed()
                  .setAuthor(message.guild.name, message.guild.iconURL())
                  .setColor('BLACK')
                  .setFooter(client.user.username, client.user.avatarURL())
                  .setDescription(`${client.emotes.no} <@${message.author.id}> **Wait 5 seconds before using next command!.**`)
                  .setTimestamp();
            return message.channel.send(embed);
    } else {
commandfile.run(client, message, args);
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          talkedRecently.delete(message.author.id);
        }, ms(commandfile.config.cooldown));
    }
} else {
commandfile.run(client, message, args);
}
}

    } catch (error) {
        console.log(error);
    }
};