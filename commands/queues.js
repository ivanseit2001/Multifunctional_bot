const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queues")
        .setDescription("show pages of songs"),

    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)
        console.log(interaction.options)
        // check if there are songs in the queue
        if (!queue || !queue.node.isPlaying())
        {
            await interaction.reply("No songs!\nhttps://i.pinimg.com/originals/4c/7c/66/4c7c669c255123a68c2474ccf5ab7ab9.gif");
            return;
        }
        let current_page=0
        // Get the first 20 songs in the queue
        const embedss=[]
        let k=10;
        for(let i=0;i<= queue.tracks.data.length; i += 10){
            const queueString = queue.tracks.data.slice(i, k);
            let j=i;
            k+=10;
            const info=queueString.map(song => `${++j} - [${song.duration}]\` [${song.title}](${song.url}) - <@${song.requestedBy.id}>`).join('\n')
            const currentSong = queue.currentTrack;
            
            const progress=queue.node.createProgressBar();
            const collector=new EmbedBuilder()
            .setDescription(`**Currently Playing**\n` + 
                (currentSong ? `\`[${currentSong.duration}]\` [${currentSong.title}](${currentSong.url}) - <@${currentSong.requestedBy.id}>` : "None")
                +`\n`+progress+
                `\n\n**Queue**\n${info}`
            )
            .setThumbnail(currentSong.thumbnail)
            embedss.push(collector)
        }
        
        
        let currentPage=0;
        const msg = await interaction.reply({
            embeds:
                [embedss[currentPage]]
            ,
        fetchReply:true
    });
        await msg.react('⬅️');
        await msg.react('➡️');

        const collectorFilter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && (user.id==interaction.user.id);
        const collectEmotes=msg.createReactionCollector({ filter: collectorFilter, time: 300000 });
        collectEmotes.on('collect',async(reaction,user)=>{
            try {
                if (reaction.emoji.name === '➡️') {
                    if (currentPage < embedss.length - 1) {
                        currentPage++;
                        await interaction.editReply({embeds:
                            [embedss[currentPage]]
                        ,fetchReply:true});
                     } 
                } else if (reaction.emoji.name === '⬅️') {
                    if (currentPage !== 0) {
                        --currentPage;
                        await interaction.editReply({embeds:
                            [embedss[currentPage]]
                        ,fetchReply:true});
                    }
                } else {
                    collectEmotes.stop();
                    reaction.message.reactions.removeAll();
                    msg.delete();
                }
                await reaction.users.remove(interaction.user.id);
              } catch{
                console.log(console.error)

              }
        })
        
    }

}
