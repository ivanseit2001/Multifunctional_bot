const {SlashCommandBuilder}=require("@discordjs/builders")
const {EmbedBuilder}=require("discord.js")

module.exports={
    data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek the time stamp of the song")
    .addStringOption(option=>option.setName("minute").setDescription("enter the minute").setRequired(true))
    .addStringOption(option=>option.setName("second").setDescription("enter the second").setRequired(true)),

execute: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId)
    const currentSong=queue.current
    // check if there are songs in the queue
    if (!queue || !queue.node.isPlaying())
    {
        await interaction.reply("No songs!\nhttps://media.tenor.com/P_Qu80HM5_MAAAAd/bocchi-the-rock-bocchi.gif");
        return;
    }
    let Minute=interaction.options.getString("minute")
    let Seconds=interaction.options.getString("second")
    if (isNaN(+Minute) || isNaN(+Seconds)){
        return interaction.reply("Invalid time\r\nhttps://media.tenor.com/P_Qu80HM5_MAAAAd/bocchi-the-rock-bocchi.gif")
    }
    Milliseconds=(+Minute)*60+(+Seconds)
    console.log(Milliseconds)
    await queue.node.seek(Milliseconds*1000)
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`Song jumped to`+Minute+Seconds
                )
                
        ]
    })
}}