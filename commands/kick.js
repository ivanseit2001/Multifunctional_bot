const { SlashCommandBuilder,EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports={
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick the member provided")
    //.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option=>
        option.setName("target")
        .setDescription("The member you'd like to kick'")
        .setRequired(true))
    .addStringOption(option=>option.setName('reason')
    .setDescription("The reason for kicking the member provided")),
    execute: async ({ client, interaction })=>{
        console.log(interaction.options); // Check if options is defined
        const user=interaction.options.getUser("target");
        console.log(user);
        //const user=interaction.options.getUser('target');
        let reason=interaction.options.getString('reason');
        const member = await interaction.guild.members
            .fetch(user.id)
            .catch(console.error);
        
        
        
        const botMember = interaction.guild.members.cache.get(client.user.id);
        const botHighestRole = botMember.roles.highest;

        if(botHighestRole.position<=member.roles.highest.position){
            await interaction.reply({
    
                embeds: [
                new EmbedBuilder()
                    .setDescription(`My permission is not high enough to kick this member`
                    )
                    
            ]})
    
    
        }
        else if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                console.log('This member can kick');
                if (!reason) reason="Skill issue.";
        if (member.roles.highest.position<interaction.member.roles.highest.position){       
            await member.kick(reason).catch(console.error);
        // user.send({content: `You have been kicked from ${interaction.guild.name}\nReason :${reason}`})
        // .catch(console.log('user\'s DM\'s are off.'));
        
            await interaction.reply({

            embeds: [
            new EmbedBuilder()
                .setDescription(`${user} kicked because of ${reason}`
                )
                
        ]
    
    })}else{ await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`You cannot kick this member since he has equal or higher permissions`
                )
                
        ]
    })}
            }else{
                await interaction.reply({

                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`You do not have permission to use this command`
                            )
                            
                    ]
                    
                })
            }

},
};
