const config = require("../config.js");
const { ActivityType  } = require("discord.js")
module.exports = async (client) => {
let lang = client.language
lang = require(`../languages/${lang}.js`);

if (config.mongodb) {
const mongoose = require("mongoose")
mongoose.connect(config.mongodb, {
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(async () => {
console.log(`Mongodb Conectado!`)

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const rest = new REST({ version: "10" }).setToken(config.TOKEN);
(async () => {
try {
await rest.put(Routes.applicationCommands(client.user.id), {
body: await client.commands,
});
console.log(lang.loadslash)
} catch (err) {
console.log(lang.error3 + err);
}
})();

console.log(client.user.username + lang.ready);
  
setInterval(() => client.user.setActivity({ name: `${config.status}`, type: ActivityType.Streaming, url: "https://twitch.tv/beartvgames1" }), 30000);
client.errorLog = client?.channels?.cache?.get(config.errorLog) ? client?.channels?.cache?.get(config.errorLog) : undefined;

setTimeout(async () => {
const db = require("../mongoDB");
await db.loop.deleteOne()
await db.queue.deleteOne()
await db.playlist_timer.deleteOne()
await db.playlist_timer2.deleteOne()
}, 5000)

}).catch((err) => {
console.log("\nMongoDB Error: " + err + "\n\n" + lang.error4)
})

} else {
console.log(lang.error4)
}


if(client.config.voteManager.status === true && client.config.voteManager.api_key){
const { AutoPoster } = require('topgg-autoposter')
const ap = AutoPoster(client.config.voteManager.api_key, client)
ap.on('posted', () => {
})
}

}
