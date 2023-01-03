const db = require("../../mongoDB");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = async (client, queue) => {
let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
lang = lang?.language || client.language
lang = require(`../../languages/${lang}.js`);
    let finishsong = new EmbedBuilder()
         .setColor(client.config.embedColor)
        .setTitle("Finish Song!")
       .setDescription(`${lang.msg14}`)
        .setTimestamp()
    
    
if (queue?.textChannel) {
queue?.textChannel?.send({ embeds: [finishsong] }).catch(e => { })
}
}
