const Discord=require('discord.js');

const Canvas=require('canvas');
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
    welcomeCanvas.context.fillText("Welcome",360,360);
    welcomeCanvas.context.beginPath();
    welcomeCanvas.context.arc(512,166,128,Math.PI*2,true);
    welcomeCanvas.context.stroke()
    welcomeCanvas.context.fill()
})
console.log("Pass 1")
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
        const message = `Nice to meet you<@${member.id}>. Welcome to BAKA!
        You'll be able to see the rest of the server after you've indicated you've read the rules in ${channel3}. Feel free to ask any questions to one of our executives \n`;
        if (channel==null)
        {console.log("Not this server")}
        else{
            //channel.send(message);
            let canvas=welcomeCanvas;
            canvas.context.font = '42px sans-serif',
            canvas.context.textAlign = 'center';
            canvas.context.fillText(member.user.tag.toUpperCase(),512,410)
            console.log("pass 2")
            canvas.context.font='32px sans-serif'
            canvas.context.fillText(`To BAKA`,512,455)
            canvas.context.beginPath()
            canvas.context.arc(512,166,119,0,Math.PI*2,true)
            canvas.context.closePath()
            canvas.context.clip()
            console.log(member.user.displayAvatarURL())
            await Canvas.loadImage(member.user.displayAvatarURL({extension:"png",size:1024}))
            .then(img=>{
                canvas.context.drawImage(img,393,47,238,238);
                console.log("Pass 4")
            })
            console.log("pass 5")
            //let atta=new Discord.Attachment(canvas.create.toBuffer(),`welcome-${member.id}.png`)
            try{
                channel.send(message)
                channel.send({files:[{attachment:canvas.create.toBuffer()}]})
            } catch(error){
                console.log(error)
            }
        }
    });
};