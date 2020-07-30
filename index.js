const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { sep } = require('path');
const { success, error, warning } = require('log-symbols');
const config = require('./config.json');
require('dotenv').config();
const Client = require('./client/Client');

const bot = new Client(config);

const loadCommands = (dir = "./commands") =>
{
    readdirSync(dir).forEach(dirs =>
    {
        const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));

        for(const file of commands)
        {
            const pull = require(`${dir}/${dirs}/${file}`);

            if(pull.help && typeof(pull.help.name) === "string" && typeof(pull.help.category) === "string")
            {
                if(bot.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}`);
                bot.commands.set(pull.help.name, pull);

                console.log(`${success} Loaded command ${pull.help.name} from ${dir}${sep}${dirs}`);
            }
            else
            {
                console.error(`${error} Error loading command in ${dir}${sep}${dirs}. You either have a missing help.name or help.name is not a string, or you have a missing help.category or help.category is not a string`);
                continue;
            }

            if(pull.help.aliases && typeof(pull.help.aliases) === "object")
            {
                pull.help.aliases.forEach(alias =>
                {
                    if(bot.aliases.get(alias)) return console.warn(`${warning} Two or more commands have the same alias ${alias}`);
                    bot.aliases.set(alias, pull.help.name);
                });
            }
        }
    });
}

loadCommands();

bot.once('ready', () =>
{
    // bot.user.setActivity({ name: "over these humans", type: "WATCHING"}).then().catch(error => console.log(error));
    bot.user.setPresence(
    {
        activity:
        {
            name: "A simulation of Earth",
            type: "WATCHING"
        }
    }).catch(error => console.log(error));
    console.log("Discourse Integration Bot is ready");
});

bot.once('reconnecting', () =>
{
    console.log("Discourse Integration Bot reconnecting");
});

bot.once('disconnect', () =>
{
    console.log("Discourse Integration Bot disconnecting");
});

bot.on('message', async message =>
{
    const prefix = bot.config.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let command;

    if(message.author.bot || !message.guild) return;
    if(!message.content.startsWith(prefix)) return;

    if(cmd.length === 0) return;
    if(bot.commands.has(cmd)) command = bot.commands.get(cmd);
    else if(bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));

    if(command) command.execute(bot, message, args);
});

bot.login(process.env.TOKEN).catch(error => console.log(error));
