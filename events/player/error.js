module.exports = async (client, textChannel, e) => {
if (textChannel){
   return textChannel?.send(`**Se encontró un error:** ${e.toString().slice(0, 1974)}`)
}
}
