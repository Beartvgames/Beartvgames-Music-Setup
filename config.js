module.exports = {
TOKEN: "",
ownerID: "",
botInvite: "",
supportServer: "",
mongodb: "",
status: '',
commandsDir: './commands', //Not Touch please xD
language: "en",
embedColor: "#460f8c",
errorLog: "", //Channel ID Ok!
  
    voteManager: {
        status: false,
        api_key: "",
        vote_commands: ["channel","clear","dj","loop","nowplaying","pause","play","playlist","queue","resume","search","skip","stop","volume"],
        vote_url: "",
    },
  
   shardManager:{
     shardStatus: false
   },

    playlistSettings:{
        maxPlaylist: 10,
        maxMusic: 50,
    },

opt: {
DJ: {
commands: ['clear', 'loop', 'pause', 'resume', 'skip', 'volume', 'shuffle']
},

voiceConfig: {
leaveOnFinish: false,
leaveOnStop: false,

leaveOnEmpty: {
status: true,
cooldown: 1000,
},

},

maxVol: 150,

}
}
