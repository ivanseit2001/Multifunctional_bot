// function shuffle(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
//       // swap elements array[i] and array[j]
//       // we use "destructuring assignment" syntax to achieve that
//       // you'll find more details about that syntax in later chapters
//       // same can be written as:
//       // let t = array[i]; array[i] = array[j]; array[j] = t
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//   }
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("shuffle the song list"),

    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)

        // check if there are songs in the queue
        if (!queue || !queue.node.isPlaying())
        {
            await interaction.reply("No songs!\r\nhttps://tenor.com/view/bocchi-bocchi-the-rock-non-linear-gif-27023528");
            return;
        }

        // var shuffle_list=[]
        // for (i=0;i<queue.length;i++){
        //     shuffle_list.push([queue.tracks[i],queue.tracks[i+1]])
        // }
        // shuffle(shuffle_list)
        // for (z=0;z<queue.length;z++){
        //     await queue.skip()
        // }
        // for (y=0;y<shuffle_list.length;y++){
        //     await queue.addTrack(shuffle_list[y][1])
        //     await queue.addTrack(shuffle_list[y][2])
        // }
        queue.tracks.shuffle();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Queue has been shuffle`)
                    
            ]
        })
    }
}
