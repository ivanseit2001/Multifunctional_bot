const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("move a song from a position to another")
        .addStringOption(option=>
            option.setName("track_number").setDescription("The track you want to move").setRequired(true)
        )
        .addStringOption(option=>
            option.setName("position").setDescription("Position you want to move to").setRequired(true))
        ,

        execute: async ({ client, interaction }) => {
            const queue = client.player.nodes.get(interaction.guildId)
            let track_number=interaction.options.getString("track_number")
            let position=interaction.options.getString("position")
            if (isNaN(+track_number) ||isNaN(+position)){return interaction.reply("This is not a number\r\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601")}
            if(queue.tracks.data[+track_number]==null||queue.tracks.data[+position]==null){
                return interaction.reply("Out of range\r\nhttps://tenor.com/view/boowomp-nijika-ijichi-nijika-ichiji-boowomp-gif-27229601")
            }
            const target_song=queue.tracks.data[+track_number]
            queue.node.move(queue.tracks.data[+track_number],+position)
            
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(target_song.title+` is moved to `+position
                        )
                        .setThumbnail(target_song.thumbnail)
                        
                ]
            })
        
        }
        
    }