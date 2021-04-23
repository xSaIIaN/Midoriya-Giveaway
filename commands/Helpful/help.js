const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const db = require('old-wio.db');
const { stripIndents } = require("common-tags");
const { PREFIX } = require('../../config/config.json');
module.exports = {
    config: {
  name: "help",
  aliases : ['h'],
  usage: "<optional command name>",
  description: "Shows all available bot commands.",
    },
  run: async (client, message, args) => {

    let prefix;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);

        if (fetched === null) {
            prefix = PREFIX
        } else {
            prefix = fetched
        }
        
    const roleColor =
      message.guild.me.displayHexColor === "#ee7373"
        ? "RANDOM"
        : message.guild.me.displayHexColor;

    if (!args[0]) {
      let categories = [];

      const dirEmojis = {
        Giveaway: "<:giveaway:829315878653919343>",
        Helpful: "<:helpers:817355884401131520>",
        owner: ""
      }
      readdirSync("./commands/").forEach((dir) => {
        const editedName = `${dirEmojis[dir]} ${dir.toUpperCase()}`
        const hiddenC = ['owner']
        if(hiddenC.includes(dir)) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );
        const cmds = commands.filter((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          return !file.hidden;
        }).map((command) => {
          let file = require(`../../commands/${dir}/${command}`);
          if (!file.config.name) return "No command name.";
          let name = file.config.name

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: editedName,
          value: cmds.length === 0 ? "In progress." : cmds.join(" "),
        };

        categories.push(data);
      });

      const embed = new MessageEmbed()
        .setTitle("📬 Need help? Here are all of my commands:")
        .addField("Info", `Prefix: \`${prefix}\``)
        .addFields(categories)
        .setDescription(
          `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ping\`.`
        )

        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(roleColor);
      return message.channel.send(embed);
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
          .setColor("FF0000");
        return message.channel.send(embed);
      }

      const embed = new MessageEmbed()
        .setTitle("Command Details:")
        .addField("PREFIX:", `\`${prefix}\``)
        .addField(
          "COMMAND:",
          command.name ? `\`${command.name}\`` : "No name for this command."
        )
        .addField(
          "ALIASES:",
          command.aliases
            ? `\`${command.aliases.join("` `")}\``
            : "No aliases for this command."
        )
        .addField(
          "USAGE:",
          command.usage
            ? `\`${prefix}${command.name} ${command.usage}\``
            : `\`${prefix}${command.name}\``
        )
        .addField(
          "DESCRIPTION:",
          command.description
            ? command.description
            : "No description for this command."
        )
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(roleColor);
      return message.channel.send(embed);
    }
  },
};