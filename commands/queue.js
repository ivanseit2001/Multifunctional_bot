const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows first 10 songs in the queue"),

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
        // Get the first 10 songs in the queue
        const queueString = queue.tracks.data.slice(0, 20).map((song, i) => 
        {
            return `${i} [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
            // if (i%2==0 && i>0){
            // return `${i/2}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`}
        }).join("\n")

        // Get the current song
        const currentSong = queue.currentTrack;
        const progress=queue.node.createProgressBar();
        const collector=new EmbedBuilder()
        .setDescription(`**Currently Playing**\n` + 
            (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None")
            +`\n`+progress+
            `\n\n**Queue**\n${queueString}`
        )
        .setThumbnail(currentSong.thumbnail)
    
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None")
                        +`\n`+progress+
                        `\n\n**Queue**\n${queueString}`
                    )
                    .setThumbnail(currentSong.thumbnail)
                    
            ]
        })
    }
}

function embedGenerator(serverQueue){
    const embeds=[]
    let songs=10;
    for(let i=0;i<serverQueue.songs.length;i+=10){
        const current=serverQueue.song.slice(i,songs)
        songs+=10;
        let j=i;
        const info=current.map(song=>`${++j} [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`).join('\n')
        const currentSong=serverQueue.currentTrack
        const msg=new EmbedBuilder()
        .setDescription()
    }
}
