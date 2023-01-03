const config = require('./config.js');

if(config.shardManager.shardStatus == true){

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: config.TOKEN});
manager.on('shardCreate', shard => console.log(`Shard ${shard.id}`));
manager.spawn();

} else {

require("./bot.js")

}
