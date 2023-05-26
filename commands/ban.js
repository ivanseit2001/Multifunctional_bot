const { SlashCommandBuilder,EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports={
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban the member provided")
    //.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option=>
        option.setName("target")
        .setDescription("The member you'd like to ban'")
        .setRequired(true))
    .addStringOption(option=>option.setName('reason')
    .setDescription("The reason for banning the member provided"))
    // .addStringOption(option=>
    //     option.setName("messages")
    //     .setDescription("Choose how many messages you want to delete")
    //     .addChoices({name:"None",value:0},
    //     {name:"Previous 7 days",value: 7}
    //     ))
    ,
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
        else if (interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                console.log('This member can ban');
                if (!reason) reason="Skill issue.";
        if (member.roles.highest.position<interaction.member.roles.highest.position){       
            await member.ban({days:0,reason:reason})
            .catch(console.error);
        // user.send({content: `You have been banned from ${interaction.guild.name}\nReason :${reason}`})
        // .catch(console.log('user\'s DM\'s are off.'));
        
            await interaction.reply({

            embeds: [
            new EmbedBuilder()
                .setDescription(`${user} banned because of ${reason}`
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
