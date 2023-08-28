const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType,useMasterPlayer } = require("discord-player")

module.exports={
   data: new SlashCommandBuilder()
   .setName("insert")
   .setDescription("Insert a track in specific position")
   .addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
   .addStringOption(option => option.setName("position").setDescription("position you want to insert").setRequired(true)),


   execute: async({client,interaction})=>{
    if (!interaction.member.voice.channel) return interaction.reply("You are not here!\r\nhttps://media.tenor.com/P_Qu80HM5_MAAAAd/bocchi-the-rock-bocchi.gif");
            // Create a play queue for the server
		const queue = await client.player.nodes.create(interaction.guild);
        
        // Wait until you are connected to the channel
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        if (queue.connection) (console.log(interaction.user.id))
        //if (interaction.user.id!="678530314552868893") return interaction.reply("You are not allowed to use it")

		let embed = new EmbedBuilder()
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
        let position=interaction.options.getString("position")
        if (isNaN(+position)){
            return interaction.reply("This is not a number\r\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528")
        }

    if(queue.tracks.data[+position]==null){
            position=0
        }
        queue.node.insert(song,+position)
    await interaction.reply({
    embeds:[
        new EmbedBuilder()
        .setDescription(`**[${song.title}](${song.url})** has been inserted at ${position}`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}`})]
   })

}
   }
