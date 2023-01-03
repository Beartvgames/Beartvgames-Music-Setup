const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const db = require("../mongoDB");
module.exports = {
  name: "help",
  description: "Le ayuda a obtener información sobre el bot y los comandos.",
  permissions: "0x0000000000000800",
  options: [
    {
      name: "info",
      description: "El comando sobre el que desea obtener información.",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  showHelp: false,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    try {

      const info = interaction.options.getString('info');
      if (info) {
        const cmd_filter = client.commands.filter(x => x.name === info);
        if (!cmd_filter.length > 0) return interaction.reply({ content: lang.msg127, ephemeral: true }).catch(e => { })

        const cmd = cmd_filter[0]
        const embed = new EmbedBuilder()
          .setTitle(`Informacion de comando: ${cmd.name}`)
          .setDescription(`> **Descripcion: \`${cmd.description}\`**\n> **Opciones:**\n${cmd?.options?.map(x => `> **\`${x.name}\` - \`${x.description}\`**`).join("\n")}`)
          .setColor(client.config.embedColor)
          .setTimestamp()
        return interaction.reply({ embeds: [embed] }).catch(e => { })

      } else {
        const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle("Comando de Beartvgames Music")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(lang.msg32)
          .addFields([
            { name: `** **`, value: commands.map(x => `\`/${x.name}\``).join(' , ') }
          ])
          .setTimestamp()
          .setFooter({ text: `Beartvgames Music` })
        interaction.reply({ embeds: [embed] }).catch(e => { })
      }

    } catch (e) {
      if (client.errorLog) {
        let embed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTimestamp()
          .addFields([
            { name: "Comando", value: `${interaction?.commandName}` },
            { name: "Error", value: `${e.stack}` },
            { name: "Usuario", value: `${interaction?.user?.tag} \`(${interaction?.user?.id})\``, inline: true },
            { name: "Servidor", value: `${interaction?.guild?.name} \`(${interaction?.guild?.id})\``, inline: true },
            { name: "Tiempo", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
            { name: "Comando Usado En el Canal", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
            { name: "Usuario En el Canal", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
          ])
        await client.errorLog.send({ embeds: [embed] }).catch(e => { })
      } else {
        console.log(`
    Comando: ${interaction?.commandName}
    Error: ${e}
    Usuario: ${interaction?.user?.tag} (${interaction?.user?.id})
    Servidor: ${interaction?.guild?.name} (${interaction?.guild?.id})
    Comando Usado Canal: ${interaction?.channel?.name} (${interaction?.channel?.id})
    Usuario En El Canal: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
    `)
      }
      return interaction.reply({ content: `${lang.error7}\n\`${e}\``, ephemeral: true }).catch(e => { })
    }
  },
};
