const { MessageEmbed } = require('discord.js');

module.exports.help =
{
    name: "post",
    aliases: [],
    description: "Posts an embedded specified message in the specified channel",
    usage: "post <channel> <message>",
    category: "message"
}

module.exports.execute = (bot, message, args) =>
{
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have permission to do that");
    if(args.length === 0) return message.channel.send("Please select a channel to post in.");

    const ch = args.shift().trim();
    const ch_id = ch.replace("<#", "").replace(">", "");

    bot.channels.fetch(ch_id).then(target_channel =>
    {
        if(!target_channel) return message.channel.send("That channel doesn't exist");
        if(args.length > 1) target_channel.send(new MessageEmbed().setDescription(args.join(" ")));
        else return message.channel.send("What exactly do you want me to post?");
    }).catch(error => console.error(error));
}
