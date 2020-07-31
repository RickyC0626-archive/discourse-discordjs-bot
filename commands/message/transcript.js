const { MessageEmbed, TextChannel } = require('discord.js');
const config = require('../../config.json');
const { truncate: truncateText } = require('../../util/text');

module.exports.help =
{
    name: "transcript",
    aliases: [],
    description: "Creates a transcript from the last n posts in this channel",
    usage: "transcript <n>",
    category: "message"
}

module.exports.execute = (bot, message, args) =>
{
    // if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have permission to do that");
    if(args.length === 0 || isNaN(args[0])) return message.channel.send("Please enter a valid amount of messages to create a transcript from.");
    if(args[0] > 100) return message.channel.send("The max amount of messages you can put on a transcript is 100");

    let ch = message.channel;
    let description = `Channel: <#${ch.id}>\n\n>>> `;

    last(ch.messages.cache.array(), args[0]).forEach(msg =>
    {
       description += `<@!${msg.author.id}>: ${msg.content}\n`;
    });

    const transcriptEmbed = new MessageEmbed()
        .setColor("DARK_BLUE")
        .setAuthor(`Transcript of the last ${args[0]} messages`)
        .setTitle("Click here to draft a post on Discourse")
        .setDescription(truncateText(description, 2048))
        .setFooter(bot.user.username, bot.user.avatarURL())
        .setTimestamp()
        .setURL(config.discourseUrl);

    message.channel.send({ embed: transcriptEmbed }).catch(error => console.error(error));
}

let last = (arr, n) =>
{
    if(!arr) return void 0;
    if(!n) return arr[arr.length - 1];
    return arr.slice(Math.max(arr.length - n, 0));
}
