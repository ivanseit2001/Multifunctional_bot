const Canvas=require('canvas')
const Discord=require('discord.js')
module.exports=client=>{
    const channelID="763829303460757545";
    const channelID2="750045188184866949";/*pronouns*/ 
    const channelID3="750037411333144706";/*rules*/
    const channelID4="750035714598633552";/*intro*/
    const channelID5="788995447061741598";/*meeting*/
    const channelID6="750076722459836536";//roles
    const channelID7="752623233630470156";//hangout
    const channelID8="737862143818465314";//random

    var welcomeCanvas={};
    welcomeCanvas.create=Canvas.createCanvas(1024,500)
    welcomeCanvas.context=welcomeCanvas.create.getContext('2d')
    welcomeCanvas.context.font='72px sans-serif';
    welcomeCanvas.context.fillStyle='#ffffff';
    Canvas.loadImage("./img/bg.png").then(async(img)=>{
        welcomeCanvas.context.drawImage(img,0,0,1024,500)
        welcomeCanvas.context.fillText("welcome",360,360);
        welcomeCanvas.context.beginPath();
        welcomeCanvas.context.arc(512,166,128,0,Math.PI*2,true)
        welcomeCanvas.context.stroke()
        welcomeCanvas.context.fill()

    })
     
    client.on("guildMemberAdd",async (member)=>{
        console.log(member);
        const channel = member.guild.channels.cache.get(channelID);
        const channel2 = member.guild.channels.cache.get(channelID2);
        const channel3 = member.guild.channels.cache.get(channelID3);
        const channel4 = member.guild.channels.cache.get(channelID4);
        const channel5 = member.guild.channels.cache.get(channelID5);
        const channel6 = member.guild.channels.cache.get(channelID6);
        const channel7 = member.guild.channels.cache.get(channelID7);
        const channel8 = member.guild.channels.cache.get(channelID8);
        const messageList=[`https://i.imgur.com/VluLVJT.mp4`,`https://i.imgur.com/hbIbv4i.gif`,`https://1.bp.blogspot.com/-vfgWJV2rJWQ/V3xXmUHNeFI/AAAAAAAAAK4/r2G2fm8-u-8QlKKKabXaWxk5bUEFscRJACK4B/s1600/welccome1.gif`,`https://c.tenor.com/LvPkpm53orwAAAAC/anime-kanna.gif`,`https://i.imgur.com/kSbIc8p.gif`,`https://pa1.narvii.com/6548/adef787ccc92b88c1dc0d7a7d30311f7dd7410f3_hq.gif`] ;
        randomItem = messageList[Math.floor(Math.random()*messageList.length)];
        const message = `Nice to meet you<@${member.id}>You'll be able to see the rest of the server after you've selected a pronoun role and the meeting roles in ${channel6} at roleypoly and indicated you've read the rules in ${channel3}. You can introduce yourself in ${channel4} and read about our current meeting schedule in ${channel5}. Otherwise, ask questions here or in ${channel7}  if you have any! We're usually chilling there!`+randomItem;
        
        if (channel!=null){
            let canvas=welcomeCanvas;
            canvas.context.font='42px sans-serif',
            canvas.context.textAlign='center';
            canvas.context.fillText(member.user.tag.toUpperCase(),512,410)
            canvas.context.font='32px sans-serif'
            canvas.context.fillText(`You are the ${member.guild.memberCount}th`,512,455)
            canvas.context.beginPath()
            canvas.context.arc(512,166,119,0,Math.PI*2,true)
            canvas.context.closePath()
            canvas.context.clip()
            await Canvas.loadImage(member.user.displayAvatarURL({extension:'png',size:1024}))
            .then(img=>{canvas.context.drawImage(img,393,47,238,238);
            })
            console.log(member.user.displayAvatarURL({extension:'png',size:1024}))
            console.log("Passed 1")
            // canvas.create.toBuffer()
            //let atta = new MessageAttachment(canvas.create.toBuffer(),`welcome-${member.id}.png`)
            
            try{
            channel.send(`Testing in progress ${member}`)
            channel.send({files: [canvas.create.toBuffer()]})
            
            
        }
            catch(error)
            {console.log(error)}
            channel.send(message);
            
        }
        else {console.log("Does not work here")}
    });
};
