const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skip to one song")
		.addStringOption(option=>option.setName("track").setDescription("track number").setRequired(true))
        ,

    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)

        // check if there are songs in the queue
        if (!queue || !queue.node.isPlaying())
        {
            await interaction.reply("No songs!\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528");
            return;
        }
        let track_number=interaction.options.getString("track")
        console.log(+track_number)
        if (isNaN(+track_number)){
                return interaction.reply("This is not a number\r\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528")
            }

        if(queue.tracks.data[+track_number-1]==null){
                return interaction.reply("Out of range\r\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528")
            }
        const target_track=queue.tracks.data[+track_number-1]
        // for (let i=+track_number;i>0;i--){
        //     queue.remove(i)
        //     }
        queue.node.skipTo(+track_number-1)
        var currentSong = queue.currentTrack;

        
        
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(target_track.title)
                    .setURL(target_track.url)
                    .setThumbnail(target_track.thumbnail)
                    .setDescription(`Skippped to ${target_track.title}`)
                    
            ]
        })
    }
}
