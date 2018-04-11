const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const YN_list = require("./YN_List.json");
const memberQueue = require("./memberQueue.json");
const hruf_List = require("./HRUF.json")



client.on('ready', () => {
    console.log(`Anthabot 1.0.5 STABLE successfully connected. Awaiting Commands`);
});

/*things to work on: Server greeting and access*/

client.on('guildMemberAdd', member => {
    member.send(`Welcome to the Server, ${member.displayName}! I'm Antha-Bot, nice to meet you! Before we can get down to business, you need to read the rules first and find the magic keyword that grants you member access! When you find the keyword, just enter it in the #rules-and-Access channel, and you will be granted access automatically! Need help? My bot suffix is "!Yo!"`);
    console.log(`${member.displayName} has joined the server at ${member.joinedAt}`)
});

client.on('guildMemberRemove', member => {
    console.log(`${member.displayName} has left the server at ${Date}`)
});

client.login(config.token)

client.on('message', msg => { 
    //Below is the prevention of Botception.
    if (msg.author.bot) return
    //User-initiated commands
    //PING
    if (msg.content.startsWith(config.prefix + "ping")) {
        msg.reply('Pong!');
    }
   //Yes/No Function
    if (msg.content.startsWith(config.prefix + "Anthabot,")) {
        msg.reply(YN_list.YN_options[Math.floor(Math.random() * 51)])
    }
    //is your mom gay?
    if (msg.content.startsWith(config.prefix + "is your mom gay?")) {
        msg.reply("no u")
    }
    //Hello function
    if (msg.content.startsWith(config.prefix) + "Hello!"){
        msg.reply("Hi there!")
    }
    //how are you function
    if (msg.content.startsWith(config.prefix) + "How are you feeling?"){
            msg.reply(hruf_List.HRUFList[Math.floor(Math.random() * 10)])
    }    

    
    //Gatekeeper
    var GuildID = client.guilds.get('404304756845051905')
    let MemberRole = GuildID.roles.get('404333218922233858')
    if (msg.content.toLowerCase() == 'agree' && msg.channel.type === 'dm') {

        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(MemberRole.id)) return
            if(!member.roles.has(MemberRole.id)){
            if (!msg.content.includes() == 'agree')return
        }
            else {
                member.addRole(MemberRole).then(() => {
                    msg.author.send(`Congratulations! You are now a member of the server! Enjoy your stay :D`)
                    client.on("roleUpdate", MemberRole => {
                        msg.channel.send(`${member.displayName} has been verified! Welcome to the server!`)
                        console.log(`${member.displayName} has been verified via DM`)
                    })
                })
            }
        }
    )}


    if (msg.content.toLowerCase() == 'agree' && msg.channel.id === '404305206743007254') {
        if (msg.member.roles.has(MemberRole.id)) return
            if(!member.roles.has(MemberRole.id)){
                if (!msg.content.includes() == 'agree')return
        }
        msg.member.addRole(MemberRole)
        msg.delete()
        msg.member.send(`Congratulations! You are now a member of the server! Enjoy your stay :D`)
        client.channels.get('404304757558345739').send(`${msg.member.displayName} has been verified and confirmed as a new member! Please welcome them to the server!`)
        console.log(`${msg.member.displayName} has been verified via Guild Channel.`)
    };
})
