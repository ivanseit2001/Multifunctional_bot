const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("remove a song")
        .addSubcommand(subcommand =>
			subcommand
				.setName("single")
				.setDescription("Removes a song from the playlist")
				.addStringOption(option =>
					option.setName("track").setDescription("track number").setRequired(true)
				)
		)
        .addSubcommand(subcommand=>
            subcommand
            .setName("range")
            .setDescription("Removes a range of songs from the playlist")
            .addStringOption(option=>
                option.setName("beginning").setDescription("track number").setRequired(true)
            )
            .addStringOption(option=>
                option.setName("ending").setDescription("track number").setRequired(true))
            )
        ,

    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)

        // check if there are songs in the queue
        if (!queue || !queue.isPlaying())
        {
            await interaction.reply("No songs!\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601");
            return;
        }
        var removed_song
        // Get the first 10 songs in the queue
        if (interaction.options.getSubcommand()==="single"){
            let track_number=interaction.options.getString("track")
            console.log(+track_number)
            if (isNaN(+track_number)){
                return interaction.reply("This is not a number\r\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601")
            }

            if(queue.tracks.data[(+track_number-1)]==null){
                return interaction.reply("Out of range\r\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601")
            }
            removed_song=queue.tracks.data[+track_number-1]
            queue.node.remove((+track_number-1))
        }

        if (interaction.options.getSubcommand()==="range"){
            let opening=interaction.options.getString("beginning")
            let ending=interaction.options.getString("ending")
            if (isNaN(+opening) ||isNaN(+ending)){return interaction.reply("This is not a number\r\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601")}
            if(queue.tracks.data[+opening-1]==null||queue.tracks.data[+ending-1]==null){
                return interaction.reply("Out of range\r\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601")
            }

            for (let i=+ending;i>=+opening-1;i--){
                queue.node.remove(i)
            }
        }
        
        if (interaction.options.getSubcommand()==="range")
       { await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Songs Removed`)
                    
            ]
        })}else{
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(removed_song.title)
                    .setThumbnail(removed_song.thumbnail)
                    .setURL(removed_song.url)
                    .setDescription(`Song Removed`)
                        
                ]
            })
        }
    }
}
