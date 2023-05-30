const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick the bot from the channel."),
	execute: async ({ client, interaction }) => {

        // Get the current queue
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue)
		{
			await interaction.reply("There are no songs in the queue")
			return;
		}

        // Deletes all the songs from the queue and exits the channel
		queue.delete();

        await interaction.reply("Bocchi Dies\r\nhttps://tenor.com/view/bocchi-the-rock-bocchi-bocchi-the-rock-gif-explode-exploding-gif-27244799")
	},
}
