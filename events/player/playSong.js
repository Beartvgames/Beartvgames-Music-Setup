const db = require("../../mongoDB");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = async (client, queue, song) => {
let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
lang = lang?.language || client.language
lang = require(`../../languages/${lang}.js`);
if (queue) {
if (!client.config.opt.loopMessage && queue?.repeatMode !== 0) return;
if (queue?.textChannel) {
    let Play = lang.msg13.replace("{track?.title}", song?.name).replace("{queue?.connection.channel.name}", `<#${queue.voice.connection.joinConfig.channelId}>`);
    const track = queue.songs[0];
    let playSong = new EmbedBuilder()
    .setTitle("Play Song!")
    .setThumbnail(track.thumbnail)
    .setDescription(`${Play}`)
    .setColor(client.config.embedColor)
    .addFields({ name: `${lang.msg138}`, value: `[URL](${track.url})`, inline: false})
    .addFields({ name: `Duration`, value: `${track.formattedDuration}`, inline: false})
    .addFields({ name: `By`, value: `<@${track.user.id}>`, inline: true})
    
queue?.textChannel?.send({ embeds: [playSong]});
}
}
}
