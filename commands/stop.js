const db = require("../mongoDB");
const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "stop",
  description: "Detiene una Musica.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);

    try {

      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: lang.msg5, ephemeral: true }).catch(e => { })
      queue.stop(interaction.guild.id);
        
          let stopped = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle(`${lang.msg85}`)
          .setTimestamp()
          .setFooter({ text: "Music Stopped..."})
      return interaction.reply({ embeds: [stopped], ephemeral: false }).catch(e => { })

    } catch (e) {
      if (client.errorLog) {
        const { EmbedBuilder } = require("discord.js")
        let embed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTimestamp()
          .addFields([
            { name: "Comando", value: `${interaction?.commandName}` },
            { name: "Error", value: `${e.stack}` },
            { name: "Usuario", value: `${interaction?.user?.tag} \`(${interaction?.user?.id})\``, inline: true },
            { name: "Servidor", value: `${interaction?.guild?.name} \`(${interaction?.guild?.id})\``, inline: true },
            { name: "Tiempo", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
            { name: "Comando Usado en el Canal", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
            { name: "Usuario en el canal", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
          ])
        await client.errorLog.send({ embeds: [embed] }).catch(e => { })
      } else {
        console.log(`
    Comando: ${interaction?.commandName}
    Error: ${e}
    Usuario: ${interaction?.user?.tag} (${interaction?.user?.id})
    Servidor: ${interaction?.guild?.name} (${interaction?.guild?.id})
    Comando Usado en el Canal: ${interaction?.channel?.name} (${interaction?.channel?.id})
    Usuario en el Canal: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
    `)
      }
      return interaction.reply({ content: `${lang.error7}\n\`${e}\``, ephemeral: true }).catch(e => { })
    }
  },
};
