const db = require("../../mongoDB");
const { EmbedBuilder, ButtonBuilder } = require("discord.js");
module.exports = async (client, queue, song) => {
let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
lang = lang?.language || client.language
lang = require(`../../languages/${lang}.js`);
    let AddSong = new EmbedBuilder()
    .setTitle(`${lang.addSong2}`)
    .setDescription(`<@${song.user.id}>, **${song.name}** ${lang.msg79}`)
    .setFooter({ text: `${lang.msg79}`})
    
queue?.textChannel?.send({ embeds: [AddSong] }).catch(e => { })
}
