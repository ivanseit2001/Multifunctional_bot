const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
// const { lyricsExtractor }=require("@discord-player/extractor")
module.exports = {
	data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Find the lyrics of the song"),

	execute: async ({ client, interaction }) => {

        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.reply("No songs!\nhttps://tenor.com/view/bocchi-the-rock-bocchi-the-rock-gif-nijika-nijika-ijichi-gif-27263161");
            return;
        }

        const currentSong = queue.currentTrack;
        // const lyricsFinder=lyricsExtractor()
        // Skip the current song
        console.log("currentSong",currentSong.description)
		const lyrics=await client.player.lyrics.search({q:currentSong.title})
        const trimmedLyrics=lyrics[0]?.plainLyrics.slice(0, 1997)||`No lyrics found for ${currentSong.title}`;
        // Return an embed to the user saying the song has been skipped
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(currentSong.title)
                    .setURL(currentSong.url)
                    .setThumbnail(currentSong.thumbnail)
                    .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
                    .setColor('Yellow')
            ]
        })
	}
}
