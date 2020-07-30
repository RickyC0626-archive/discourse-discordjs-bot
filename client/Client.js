const { Client, Collection } = require('discord.js');

module.exports =
class extends Client
{
    constructor(config)
    {
        super();

        this.commands = new Collection();
        this.aliases = new Collection();
        this.config = config;
    }
};
