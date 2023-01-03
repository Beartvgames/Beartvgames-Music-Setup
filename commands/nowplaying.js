const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "nowplaying",
  description: "Proporciona información sobre la música que se está reproduciendo.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);

    try {

      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: lang.msg5, ephemeral: true }).catch(e => { })

      const track = queue.songs[0];
      if (!track) return interaction.reply({ content: lang.msg5, ephemeral: true }).catch(e => { })

      const embed = new EmbedBuilder();
      embed.setColor(client.config.embedColor);
      embed.setThumbnail(track.thumbnail);
      embed.setTitle(track.name)
      embed.setDescription(`> Audio \`%${queue.volume}\`
> Duration \`${track.formattedDuration}\`
> URL: **[Link](${track.url})**
> Loop Mode \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\`
> By: <@${track.user.id}>`);

      embed.setTimestamp();
      embed.setFooter({ text: `Beartvgames Music` })

      const saveButton = new ButtonBuilder();
      saveButton.setLabel(lang.msg47);
      saveButton.setCustomId('saveTrack');
      saveButton.setStyle(ButtonStyle.Success);
      saveButton.setDisabled(true);

      const row = new ActionRowBuilder().addComponents(saveButton);

      interaction.reply({ embeds: [embed], components: [row] }).catch(e => { })

    } catch (e) {
      if (client.errorLog) {
        let embed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTimestamp()
          .addFields([
            { name: "Command", value: `${interaction?.commandName}` },
            { name: "Error", value: `${e.stack}` },
            { name: "User", value: `${interaction?.user?.tag} \`(${interaction?.user?.id})\``, inline: true },
            { name: "Guild", value: `${interaction?.guild?.name} \`(${interaction?.guild?.id})\``, inline: true },
            { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
            { name: "Command Usage Channel", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
            { name: "User Voice Channel", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
          ])
        await client.errorLog.send({ embeds: [embed] }).catch(e => { })
      } else {
        console.log(`
    Command: ${interaction?.commandName}
    Error: ${e}
    User: ${interaction?.user?.tag} (${interaction?.user?.id})
    Guild: ${interaction?.guild?.name} (${interaction?.guild?.id})
    Command Usage Channel: ${interaction?.channel?.name} (${interaction?.channel?.id})
    User Voice Channel: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
    `)
      }
      return interaction.reply({ content: `${lang.error7}\n\`${e}\``, ephemeral: true }).catch(e => { })
    }
  },
};
