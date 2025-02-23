const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType,useMasterPlayer } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("playlists")
		.setDescription("Plays several playlists")
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Plays a playlist from soundcloud,spotify or youtube")
				.addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
                .addStringOption(option=>option.setName('shuffle')
                .setDescription("1 if you want shuffling. Otherwise no shuffling"))
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


        if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")
            url_list=url.split(",")
            var counter=0
            for(const link of url_list) {
            const result = await client.player.search(link, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                {
                interaction.reply(`No playlists found with ${link}\nhttps://media.tenor.com/P_Qu80HM5_MAAAAd/bocchi-the-rock-bocchi.gif`)
                continue;
            }
            
            // Add the tracks to the queue
            const playlist = result.playlist
            for (i=0;i<result.tracks.length;i++){
                counter+=1
                await queue.addTrack(result.tracks[i])
                // await queue.addTrack(result.tracks[i])
            }
        }
            if(counter==0){
                return interaction.reply(`No songs has been added\nhttps://media.tenor.com/P_Qu80HM5_MAAAAd/bocchi-the-rock-bocchi.gif`)
            }
            //await queue.addTracks(result.tracks)
            embed
                .setDescription(`${queue.tracks.data.length} songs have been added to the Queue`)
                .setThumbnail(queue.tracks.data[0].thumbnail)
                let shuffle=interaction.options.getString('shuffle')
                if (shuffle=="1"){
                queue.tracks.shuffle();}
		} 


        // Play the song
        if (!queue.node.isPlaying()) await queue.node.play();
        console.log("Passed node playing")
        // Respond with the embed containing information about the player
        await interaction.reply({
            embeds: [embed]
        })
	}
}