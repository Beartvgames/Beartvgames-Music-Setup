const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "play",
  description: "Reproducir una Musica",
  permissions: "0x0000000000000800",
  options: [
    {
      name: "normal",
      description: "Reproduce una musica Normal.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "nombre",
          description: "Escribe el nombre de tu música.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: "playlist",
      description: "Escribe El Nombre De Tu PlayList",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "nombre",
          description: "Escribe el nombre de la lista de reproducción que deseas crear.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
  ],
  voiceChannel: true,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);

    try {
      let stp = interaction.options.getSubcommand()

      if (stp === "playlist") {
        let playlistw = interaction.options.getString('nombre')
        let playlist = await db?.playlist?.find().catch(e => { })
        if (!playlist?.length > 0) return interaction.reply({ content: lang.msg52, ephemeral: true }).catch(e => { })

        let arr = 0
        for (let i = 0; i < playlist.length; i++) {
          if (playlist[i]?.playlist?.filter(p => p.name === playlistw)?.length > 0) {

            let playlist_owner_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].author
            let playlist_public_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].public

            if (playlist_owner_filter !== interaction.member.id) {
              if (playlist_public_filter === false) {
                return interaction.reply({ content: lang.msg53, ephemeral: true }).catch(e => { })
              }
            }

            const music_filter = playlist[i]?.musics?.filter(m => m.playlist_name === playlistw)
            if (!music_filter?.length > 0) return interaction.reply({ content: lang.msg54, ephemeral: true }).catch(e => { })

            interaction.reply({ content: lang.msg56 }).catch(e => { })

            let songs = []
            music_filter.map(m => songs.push(m.music_url))

            setTimeout(async () => {
              const playl = await client?.player?.createCustomPlaylist(songs, {
                member: interaction.member,
                properties: { name: playlistw, source: "custom" },
                parallel: true
              });

              await interaction.editReply({ content: lang.msg57.replace("{interaction.member.id}", interaction.member.id).replace("{music_filter.length}", music_filter.length) }).catch(e => { })

              try {
                await client.player.play(interaction.member.voice.channel, playl, {
                  member: interaction.member,
                  textChannel: interaction.channel,
                  interaction
                })
              } catch (e) {
                await interaction.editReply({ content: lang.msg60, ephemeral: true }).catch(e => { })
              }

              playlist[i]?.playlist?.filter(p => p.name === playlistw).map(async p => {
                await db.playlist.updateOne({ userID: p.author }, {
                  $pull: {
                    playlist: {
                      name: playlistw
                    }
                  }
                }, { upsert: true }).catch(e => { })

                await db.playlist.updateOne({ userID: p.author }, {
                  $push: {
                    playlist: {
                      name: p.name,
                      author: p.author,
                      authorTag: p.authorTag,
                      public: p.public,
                      plays: Number(p.plays) + 1,
                      createdTime: p.createdTime
                    }
                  }
                }, { upsert: true }).catch(e => { })
              })
            }, 3000)
          } else {
            arr++
            if (arr === playlist.length) {
                let Nofound = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTimestamp()
          .setDescription(`${lang.msg58}`)
          .setFooter('No Found Music.....')
              return interaction.reply({ embeds: [Nofound], ephemeral: true }).catch(e => { })
            }
          }
        }
      }

      if (stp === "normal") {
        const name = interaction.options.getString('nombre')
            let nome = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle(`${lang.msg85}`)
          .setTimestamp()
          .setFooter({ text: "Music Stopped..."})
        if (!name) return interaction.reply({ content: lang.msg59, ephemeral: true }).catch(e => { })
          
 let cargando = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTimestamp()
          .setDescription(`${lang.msg61}`)
        await interaction.reply({ embeds: [cargando] }).catch(e => { })
        try {
          await client.player.play(interaction.member.voice.channel, name, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
          })
            
        } catch (e) {
          await interaction.editReply({ content: lang.msg60, ephemeral: true }).catch(e => { })
        }
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
            { name: "Canal de uso de comandos", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
            { name: "Canal de voz del usuario", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
          ])
        await client.errorLog.send({ embeds: [embed] }).catch(e => { })
      } else {
        console.log(`
    Comando: ${interaction?.commandName}
    Error: ${e}
    Usuario: ${interaction?.user?.tag} (${interaction?.user?.id})
    Servidor: ${interaction?.guild?.name} (${interaction?.guild?.id})
    Comando usado En Canal: ${interaction?.channel?.name} (${interaction?.channel?.id})
    Usuario Encontrado En El Canal de Voz: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
    `)
      }
      return interaction.editReply({ content: `${lang.error7}`, ephemeral: true }).catch(e => { })
    }
  },
};
