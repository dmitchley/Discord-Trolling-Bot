// Jonno#1716
// YeOldieMeatPie#4313

const ytdl = require("ytdl-core");
const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioResource,
  AudioPlayerStatus,
  createAudioPlayer,
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const specificUserTag = "Jonno#1716";
  const youtubeURL = "https://www.youtube.com/shorts/m57W5AkmgiU";

  console.log(
    `Voice state update event triggered for ${newState.member.user.tag}`
  );

  if (
    newState.member.user.tag === specificUserTag &&
    (!oldState.channelID || oldState.channelID !== newState.channelID) &&
    newState.channelID !== null
  ) {
    console.log("Attempting to join the voice channel...");

    try {
      const connection = joinVoiceChannel({
        channelId: newState.channelId,
        guildId: newState.guild.id,
        adapterCreator: newState.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();

      const playStream = () => {
        const stream = ytdl(youtubeURL, { filter: "audioonly" });
        const resource = createAudioResource(stream);
        player.play(resource);
      };

      playStream();

      player.on(AudioPlayerStatus.Idle, () => {
        console.log("Audio finished, restarting...");
        playStream();
      });

      connection.subscribe(player);

      console.log("Connected to the voice channel successfully!");
    } catch (error) {
      console.error("Failed to join the voice channel: ", error);
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "test") {
    message.channel.send("Test successful!");
  }
});

client.login(
  "MTEyMzM0NTU1NTU5NTIwNjY2Ng.Gpr-Tj.ASHbUUjBU2r0FkDZnjiVUHQ48yXl_udFCf-ZHY"
);
