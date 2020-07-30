const { MessageEmbed } = require('discord.js');

module.exports.help =
{
    name: "avatar",
    aliases: ['a', 'av'],
    description: "Displays the avatar of a specified user",
    usage: "avatar [username]",
    category: "misc"
}

module.exports.execute = (bot, message, args) =>
{
    if(!message.mentions.users.size)
    {
        let avatarURL =
            message.author.avatarURL({ size: 512, dynamic: true }) ||
            "https://media1.tenor.com/images/8c409e6f39acc1bd796e8031747f19ad/tenor.gif";

        const avatarEmbed = new MessageEmbed()
            .setTitle(`${message.author.tag}'s avatar`)
            .setImage(avatarURL);

        return message.channel.send({ embed: avatarEmbed }).catch(error => console.error(error));
    }

    message.mentions.users.map(user =>
    {
        let avatarURL =
            user.avatarURL({ size: 512, dynamic: true }) ||
            "https://media1.tenor.com/images/8c409e6f39acc1bd796e8031747f19ad/tenor.gif";

        const avatarEmbed = new MessageEmbed()
            .setTitle(`${user.tag}'s avatar`)
            .setImage(avatarURL);

        //image?: { url: string; proxy_url?: string; height?: number; width?: number; };
        return message.channel.send({ embed: avatarEmbed }).catch(error => console.error(error));
    });
}
