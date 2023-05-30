const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType,useMasterPlayer } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play a song from YouTube.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song and plays it")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Plays a playlist from YT")
				.addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Plays a single song from YT")
				.addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply("You are not here!\r\nhttps://media.tenor.com/P_Qu80HM5_MAAAAd/bocchi-the-rock-bocchi.gif");

        // Create a play queue for the server
		const queue = await client.player.nodes.create(interaction.guild);
        
        // Wait until you are connected to the channel
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        if (queue.connection) (console.log(interaction.user.id))
        //if (interaction.user.id!="678530314552868893") return interaction.reply("You are not allowed to use it")

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            
            // Search for the song using the discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
                
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply("No results")

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            // queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

		}
        else if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.reply(`No playlists found with ${url}\nhttps://media.tenor.com/P_Qu80HM5_MAAAAd/bocchi-the-rock-bocchi.gif`)
            
            // Add the tracks to the queue
            const playlist = result.playlist
            for (i=0;i<result.tracks.length;i++){
                await queue.addTrack(result.tracks[i])
                // await queue.addTrack(result.tracks[i])
            }
            //await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail.url)

		} 
        else if (interaction.options.getSubcommand() === "search") {

            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
        
            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            // queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
		}
        // if (queue.tracks[0].title.toUpperCase().includes("PADORU")){
        //     queue.skip()
            
        //     await interaction.reply("I HATE MIKU!\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601");
           
        //  }
        // Play the song
        if (!queue.node.isPlaying()) await queue.node.play();
        console.log("Passed node playing")
        // Respond with the embed containing information about the player
        await interaction.reply({
            embeds: [embed]
        })
	}
}