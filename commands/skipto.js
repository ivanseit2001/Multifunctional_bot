const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skip to one song")
		.addStringOption(option=>option.setName("track").setDescription("track number").setRequired(true))
        ,

    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        // check if there are songs in the queue
        if (!queue || !queue.playing)
        {
            await interaction.reply("No songs!\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528");
            return;
        }
        let track_number=interaction.options.getString("track")
        console.log(+track_number)
        if (isNaN(+track_number)){
                return interaction.reply("This is not a number\r\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528")
            }

        if(queue.tracks[+track_number]==null){
                return interaction.reply("Out of range\r\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528")
            }
        
        // for (let i=+track_number;i>0;i--){
        //     queue.remove(i)
        //     }
        queue.skipTo(+track_number)


        
        
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Songs skipped`
                    )
                    
            ]
        })
    }
}
