module.exports = async (client, textChannel, e) => {
if (textChannel){
   return textChannel?.send(`**Se encontrĂ³ un error:** ${e.toString().slice(0, 1974)}`)
}
}
