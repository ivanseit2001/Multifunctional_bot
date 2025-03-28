require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const {
  Client,
  GatewayIntentBits,
  Collection,
  VoiceChannel,
} = require("discord.js");
const { Player } = require("discord-player");
const { VoiceConnectionStatus } = require("@discordjs/voice");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("ffmpeg-static");
const { VoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const { DefaultExtractors } = require("@discord-player/extractor");
// const welcome =require("./welcome");
const { YoutubeiExtractor,generateOauthTokens } = require("discord-player-youtubei");
const { DeezerExtractor, NodeDecryptor } = require("discord-player-deezer")

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
// console.log("This is oauth",generateOauthTokens())
// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands"); // E:\yt\discord bot\js\intro\commands
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}
const extractors=DefaultExtractors
// Add the player on the client
client.player = new Player(client, {
  // ytdlOptions: {
  //     quality: "highestaudio",
  //     highWaterMark: 1 << 25

  // } ,
  ffmpegOptions: {
    before_options: "-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5",
    options: "-vn",
  },
});

extractors.push(YoutubeiExtractor)
console.log("Extractors", extractors);
client.player.extractors.register(DeezerExtractor,{
  decryptionKey: process.env.DEEZER_MASTER_KEY,
  arl: process.env.DEEZER_ARL_COOKIE,
  decryptor: NodeDecryptor,
  reloadUserInterval: 9 * 60 * 60 * 1000,
})
client.player.extractors.register(YoutubeiExtractor,{
    // authentication:process.env.YOUTUBE_ACCESS_STRING||"",
    generateWithPoToken:true,
    cookie: process.env.COOKIE,
    overrideDownloadOptions: 'mp4a',
    overrideBridgeMode: 'yt',
    slicePlaylist:true,
     streamOptions:{
         useClient:"WEB"
     }
})
client.player.extractors.loadMulti([YoutubeiExtractor]);
// client.player.extractors.loadDefault();
console.log(client.player.scanDeps());
client.on("debug", (message) => console.log(message));
client.on("ready", () => {
  // Get all ids of the servers
  const guild_ids = client.guilds.cache.map((guild) => guild.id);

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
  for (const guildId of guild_ids) {
    rest
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
        body: commands,
      })
      .then(() =>
        console.log("Successfully updated commands for guild " + guildId)
      )
      .catch(console.error);
  }
  // welcome(client)
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  // let voiceConnection=joinVoiceChannel({
  //     channelId:interaction.channelId,
  //     guildId:interaction.guildId,
  //     adapterCreator: interaction.guild.voiceAdapterCreator
  // })
  // voiceConnection.on("stateChange", (oldState, newState) => {
  //     const oldNetworking = Reflect.get(oldState, 'networking');
  //     const newNetworking = Reflect.get(newState, 'networking');

  //     const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
  //       const newUdp = Reflect.get(newNetworkState, 'udp');
  //       clearInterval(newUdp.keepAliveInterval);
  //     }

  //     oldNetworking.off("stateChange", networkStateChangeHandler);
  //     newNetworking.on("stateChange", networkStateChangeHandler);
  //   });
  const data = {
    guild: interaction.guild,
  };
  if (!command) return;
  try {
    await client.player.context.provide(data, () => command.execute({client,interaction}));
  } catch (error) {
    console.error(error);
    try {
      await interaction.deferReply({
        content:
          "NIJIKA.EXE IS NOT WORKING \nhttps://tenor.com/view/bocchi-the-rock-bocchi-the-rock-gif-nijika-nijika-ijichi-gif-27263161",
      });
    } catch (e) {
      console.log(e);
    }
  }
});
client.player.on("connectionCreate", (queue) => {
  queue.connection.voiceConnection.on("stateChange", (oldState, newState) => {
    if (
      oldState.status === VoiceConnectionStatus.Ready &&
      newState.status === VoiceConnectionStatus.Connecting
    ) {
      queue.connection.voiceConnection.configureNetworking();
    }
  });
});
client.login(process.env.TOKEN);
