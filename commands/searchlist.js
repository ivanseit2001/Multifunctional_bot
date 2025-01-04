const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("searchlist")
        .setDescription("Search a song in the list by name")
		.addStringOption(option=>option.setName("name").setDescription("track name").setRequired(true))
        ,

    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)

        // check if there are songs in the queue
        if (!queue || !queue.node.isPlaying())
        {
            await interaction.reply("No songs!\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528");
            return;
        }
        let track_name=interaction.options.getString("name")
        let track_num=queue.tracks.data.findIndex(item=>item.title.toLowerCase().includes(track_name.toLowerCase()))
        var response
        if(track_num){
            var target_track=queue.tracks.data[track_num]
            response=`Skipped to track ${target_track.title}`
            queue.node.skipTo(track_num)
        }else{
            response="Track not found"
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(response)
                    .setURL(target_track.url)
                    .setThumbnail(target_track.thumbnail)
            ]
        })
    }
}
