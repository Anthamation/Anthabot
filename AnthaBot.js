const Discord = require("discord.js");
const client = new Discord.Client();
const JsonDB = require('node-json-db');
const db = new JsonDB("edb", true, true);
const edb = require("./edb.json");
const jwdb = new JsonDB("wdb", true, true);
const wdb = require("./wdb.json");
const ytm = require('discord.js-musicbot-addon');
const config = require("./config.json");
const YN_list = require("./YN_List.json");
const hruf_List = require("./HRUF.json");
const fs = require('fs');

client.login(config.token)

client.on('ready', () => {
    ytm.start(client, {
        youtubeKey: config.api,
        prefix : "!DJ!",
        clearOnLeave : true,
        leaveAlt: ["quit"],
        helpCmd: "helpwith",})
    console.log(`Anthabot 1.1.0 EX successfully connected. Awaiting Commands`)
    let unverified = edb.unverified
    for (let i = 0; i < unverified.length; i++){
    let id = unverified[i].UserID
        var GuildID = client.guilds.get('404304756845051905')
        let time = unverified[i].UserEX
        let MemberRole = GuildID.roles.get('404333218922233858')
        GuildID.fetchMember(id).then (member => {
    if(member.roles.has(MemberRole.id)){
        edb.unverified = unverified.filter(entry => entry.UserID != id)
        console.log(`${member.displayName} has the Member role, removing from database.`)
        fs.writeFile('edb.json', JSON.stringify(edb, null, 2), err => {
            if(err){
                console.error(err)
            }
        })
    }
    if(new Date().getTime() >= time){
                member.kick("You have failed to verify yourself. If you wish to try again, please find another invite.")
                edb.unverified = unverified.filter(entry => entry.UserID != id)
                console.log(`${member.displayName} failed to verify. Kicking...`)
                fs.writeFile('edb.json', JSON.stringify(edb, null, 2), err => {
                    if(err){
                        console.error(err)
                    }})
                }})
            }});

/*things to work on: Server KickDB, Incorrect counter, Warning counter w/DB, Imagery, announcement, Fix disconnect on leaveDJ, fix Help(EXT READY).*/

client.on('guildMemberAdd', member => {
    var CurrentTime = new Date();
    var cms = CurrentTime.getTime();
    var UserID = member.id;
    var UserEX = cms + 30000;
    var uis = {UserID, UserEX};
        var datapath = "/unverified[]";
        db.push("/unverified[]", uis);
        db.reload();
    let unverified = edb.unverified 
    setInterval(function(){
    for (let i = 0; i < unverified.length; i++){
        let id = unverified[i].UserID
        var GuildID = client.guilds.get('404304756845051905')
        let time = unverified[i].UserEX
        if(new Date().getTime() >= time){
            GuildID.fetchMember(id).then(() => {
                member.kick("You have failed to verify yourself. If you wish to try again, please find another invite.")
            })
            edb.unverified = unverified.filter(entry => entry.UserID != id)
                    edb.unverified = unverified.filter(entry => entry.UserID != id)
                console.log(`${member.displayName} failed to verify. Kicking...`)
                fs.writeFile('edb.json', JSON.stringify(edb, null, 2), err => {
                    if(err){
                        console.error(err)
                        }})
        }
    }
    },30000)
    member.send(`Welcome to the Server, ${member.displayName}! I'm Antha-Bot, nice to meet you! Before we can get down to business, you need to verify yourself by reading the rules and find the magic keyword that grants you member access! When you find the keyword, you can enter it in the #rules-and-Access channel OR reply here, and you will be granted access automatically! Do it quick! You have 3 days until you are kicked from the server! **It's only one word with NO QUOTATIONS.** Need help? My bot suffix is "!Yo!"`);
    console.log(`${member.displayName} has joined the server at ${member.joinedAt}`)
});



client.on('guildMemberRemove', member => {
    const CurrentTime = new Date();
    console.log(`${member.displayName} has left the server at ${CurrentTime}`)
});



client.on('message', msg => { 
    const CurrentTime = new Date();
    var GuildID = client.guilds.get('404304756845051905')
    let MemberRole = GuildID.roles.get('404333218922233858')
    let ModRole = GuildID.roles.get('404332197986697216')
    let AdminRole = GuildID.roles.get('404332617190735873')
    let AnthRole = GuildID.roles.get('404332188536930314')
    var generalChannel = client.channels.get('404304757558345739')
    //Below is the prevention of Botception.
    if (msg.author.bot) return

    //Link obliterator
    if (msg.content.includes("https://discord.gg/")){
        msg.delete()
        msg.member.send('You are reminded that outside Discord server links are not permitted in the server.')
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then (member => {
        console.log(`${member.displayName} has had it's Discord link obliterated on ${CurrentTime}`)
        })}
    //User-initiated commands
    //PING
    if (msg.content.startsWith(config.prefix + "ping")) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then (member => {
        msg.reply('Pong!');
        console.log(`${member.displayName} has used the PING command on ${CurrentTime}`)
    })
    }
   //Yes/No Function
    if (msg.content.startsWith(config.prefix + "Anthabot,")) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then (member => {
        msg.reply(YN_list.YN_options[Math.floor(Math.random() * 51)])
        console.log(`${member.displayName} has used the Y/N command on ${CurrentTime}`)
    })
    }
    //is your mom gay?
    if (msg.content.startsWith(config.prefix + " is your mom gay?")) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then (member => {
        msg.reply("no u")
        console.log(`${member.displayName} has used the ISYOURMOMGAY command on ${CurrentTime}`)
    })
    }
    //Hello function
    if (msg.content.startsWith(config.prefix + "Hello!")){
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then (member => {
        msg.reply("Hi there!")
        console.log(`${member.displayName} has used the Hello! command on ${CurrentTime}`)
    })
    }
    //how are you function
    if (msg.content.startsWith(config.prefix + 'How are you?')){
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then (member => {  
            msg.reply(hruf_List.HRUFList[Math.floor(Math.random() * 10)])
            console.log(`${member.displayName} has used the HAY command on ${CurrentTime}`)
    })
    }
    //help function
    if(msg.content.startsWith(config.prefix + 'Help')){
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then (member => {
            if(!member.roles.has(MemberRole.id)){
                member.send("You have not been verified yet, so there are no commands available for you.")
            }
            if(member.roles.has(MemberRole.id)){
    member.send({embed: {
    title: "Your commands as a **__Member__**",
    description:"My prefix is __!Yo!__",
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    fields: [{
        name: "Ping",
        value:"__**Usage:**!Yo!ping__\nTest the ping",
      },
      {
        name: "Ask Anthabot(Yes/No)",
        value:"__**Usage:** !Yo!Anthabot, <Any Yes/No>__\nAsk the bot a question. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
      },
      {
        name: "Hello",
        value: "__**Usage:** !Yo!Hello__\nSay hello to the bot!", 
      },
      {
        name: "How are you?",
        value: "__**Usage:** !Yo!How are you?__\nAsk the bot how it's feeling. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
      },
      {
        name: "DJ",
        value: "__**Usage:** !DJ!<DJ command>__\nEnables DJ mode. Use the bot to play music in the VC you are currently in. For DJ help, use !DJ!Help with for a list of commands.",
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "This bot was proudly made by Anthony Rees and FlyingSixtySix"
    }
  }
});
        }
        if(member.roles.has(ModRole.id)){
            member.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Your commands as a **__Moderator__**",
    description:"My prefix is __!Yo!__",
    fields: [
        {
          name: "Warn",
          value: "__**Usage:** !Yo!warn <Mentioned Member>__\nGive a warning to a member acting up. Max cap is 3 until kicked.",
        },
        {
        name: "Kick",
        value: "__**Usage:** !Yo!kick <Mentioned Member>__\nGive that member the boot. __**Use this command with responsibily.**__",  
      },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "This bot was proudly made by Anthony Rees and FlyingSixtySix"
    }
  }
});
        }
    if(member.roles.has(AdminRole.id)){
            member.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Your commands as an **__Admin__**",
    description:"My prefix is __!Yo!__",
    fields: [
    {
        name: "Ban",
        value:"__**Usage:** !Yo!ban <Mentioned Member>__\nBan this member forever. ***__Use this command with EVEN MORE responsibily.__***",
    }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "This bot was proudly made by Anthony Rees and FlyingSixtySix"
    }
  }
});
}    
})
}
    //DJ function/controls
    if(msg.content.startsWith('!DJ!skip')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.')
            }
        })
    }
    if(msg.content.startsWith('!DJ!pause')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.')
            }
        })
    }
    
    if(msg.content.startsWith('!DJ!resume')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.'
        )}})}
    if(msg.content.startsWith('!DJ!volume')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.'
        )}})}
    if(msg.content.startsWith('!DJ!leave')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.'
        )}})}
    if(msg.content.startsWith('!DJ!join')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.'
        )}})}
    if(msg.content.startsWith('!DJ!volume')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.'
        )}})}
    if(msg.content.startsWith('!DJ!clearqueue')){
        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(AdminRole.id)) return
            if(!member.roles.has(AdminRole.id)){
                msg.reply('You do not have permission to use this command.'
        )}})}    
    //DJ Help
    if(msg.content.startsWith('!DJ!Help')){
        GuildID.fetchMember(msg.author.id).then (member => {
            member.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "**DJ Mode Commands**",
    description:"**IMPORTANT!** DJ mode uses !DJ! as the prefix.",
    fields: [
        {
        name: "Detailed command help",
        value: "__**Usage:**!DJ!help with <command>__\nSpecific help with a certain command"
        },
        {
        name: "Play",
        value:"__**Usage:**!DJ!play <url> | <search>__\nPlay audio from YouTube"
        
        },
        {
        name: "Skip",
        value:"__**Usage:**!DJ!skip [number]__\nSkip a song or multi songs with skip [some number]. Only Admins can use this command"
        
        },
        {
        name: "Queue",
        value:"__**Usage:**!DJ!queue [index]__\nDisplay the current queue or an item from the queue."
        
        },
        {
        name: "Pause",
        value:"__**Usage:**!DJ!pause__\nPause music playback. Only admins can use this command."
        
        },
        {
        name: "Resume",
        value:"__**Usage:**!DJ!resume__\nResumes music playback. Only admins can use this command"
        
        },
        {
        name: "Volume",
        value:"__**Usage:**!DJ!volume <number>__\nAdjust the playback volume between 1 and 200. Only admins can use this command."
        
        },
        {
        name: "Join",
        value:"__**Usage:**!DJ!join__\nJoins your currently connected channel. Only Admins can use this command"
        
        },
        {
        name: "Leave",
        value:"__**Usage:**!DJ!leave__\nLeaves your currently connected channel. Only Admins can use this command."
        },
        {
        name: "Clear Queue",
        value:"__**Usage:**!DJ!clearqueue__\nClears the song queue. Only Admins can use this command."
        },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "The DJ function uses the discord.js-musicbot-addon(https://www.npmjs.com/package/discord.js-musicbot-addon) made by DarkoPendragon."
    }
  }
})})}
    //anthony's commands
    if(msg.content.startsWith(config.prefix + "emit")){

    }
    //Admin Commands
    //A.Warn
    if(msg.content.startsWith(config.prefix + "Warn")){
        const user = msg.mentions.users.first();
        GuildID.fetchMember(msg.author.id).then (member => {
            if(!member.roles.has(AdminRole.id)){
                msg.delete()
                msg.member.send('You do not have permission to use this command.')
                return
            }
            if(member.roles.has(ModRole.id)) return
        if(member.roles.has(AdminRole.id)){
            if (user) {
                if (member) {
                    if (user.id = 262477177449086976){
                    msg.author.send("You cannot use this command for the owner.")
                    return
                }else {
                    msg.member.send('Your action have been brought to an Admins attention. You have been warned.')
                    console.log(`${msg.author.username} has warned ${member.displayName} on ${CurrentTime}`)
                }} 
            }
        }
        })
    }
    //A.kick  
  if (msg.content.startsWith(config.prefix + "kick")) {
   
    const user = msg.mentions.users.first();
    GuildID.fetchMember(msg.author.id).then (member => {
        if(!member.roles.has(AdminRole.id)){
                msg.delete()
                msg.member.send('You do not have permission to use this command.')
                return
            }
        if(member.roles.has(AdminRole.id)){
        if (user) {
            if (member) {
                if (user.id = 262477177449086976){
                    msg.author.send("You cannot use this command for the owner.")
                    return
                }
                else {
                member.kick('Optional reason that will display in the audit logs').then(() => {
                console.log(`${msg.author.username} has kicked ${member.displayName} on ${CurrentTime}`);
            }).catch(err => {
          msg.reply('I was unable to kick the member');
          console.error(err);
        });
      }}
       else {
        msg.member.send('That user isn\'t in this guild!');
      }
    } else {
      msg.member.send('You didn\'t mention the user to kick!');
    }
  }
})
}
    //A.Ban    
if (msg.content.startsWith(config.prefix + "ban")) {
    const user = msg.mentions.users.first();
    GuildID.fetchMember(msg.author.id).then (member => {
        if(!member.roles.has(AdminRole.id)){
                msg.delete()
                msg.member.send('You do not have permission to use this command.')
                return
            }
        if(member.roles.has(AdminRole.id)){
        if (user) {
            if (member) {
                if (user.id = 262477177449086976){
                    msg.author.send("You cannot use this command for the owner.")
                    return
                }
                else{
                member.ban('Optional reason that will display in the audit logs').then(() => {
                console.log(`${msg.author.username} has banned ${member.displayName} on ${CurrentTime}`);
            }).catch(err => {
          console.log('I was unable to kick the member');
          console.error(err);
        });
      }} else {
        msg.member.send('That user isn\'t in this guild!');
      }
    } else {
      msg.member.send('You didn\'t mention the user to ban!');
    }
  }
});
}
//Moderator commands
//M.Warn
if(msg.content.startsWith(config.prefix + "Warn")){
        const user = msg.mentions.users.first();
        let CurrentTime = new Date();
                    let mct = CurrentTime.getTime();
                    let noo = ++1;
                    let UserID = member.id;
                    let monthint = 2592000000;
                    let countEX = mct + monthint;
                    var uci = {UserID,noo,countEX};
        GuildID.fetchMember(msg.author.id).then (member => {
            if(!member.roles.has(ModRole.id)){
                msg.delete()
                msg.member.send('You do not have permission to use this command.')
                return
            }
            if(member.roles.has(AdminRole.id)) return
        if(member.roles.has(ModRole.id)){
            if (user) {
                if (member) {
                    if (user.id = 262477177449086976){
                    msg.author.send("You cannot use this command for the owner.")
                    return
                }else {
                    jwdb.push("/warned[]", uci);
                    jwdb.reload();
                    msg.member.send('Your action have been brought to a moderators attention. A counter strike has been added to a personal record. If you exceed 3 counter strikes, you will be banned from the server for a period of time.')
                    let warned = wdb.warned
    setInterval(function(){
    for (let i = 0; i < warned.length; i++){
        let id = warned[i].UserID
        var GuildID = client.guilds.get('404304756845051905')
        let time = warned[i].countEX

        if(new Date().getTime() >= time){
            GuildID.fetchMember(id).then(() => {
                member.send("For your good behavour, your warnings have been removed. Great job!")
            })
            wdb.unverified = warned.filter(entry => entry.UserID != id)
                    wdb.warned = warned.filter(entry => entry.UserID != id)
                console.log(`${member.displayName} has now clean. Removing from warning database.`)
                fs.writeFile('wdb.json', JSON.stringify(wdb, null, 2), err => {
                    if(err){
                        console.error(err)
                        }})
        }
    }
    },30000)
                    console.log(`${msg.author.username} has warned ${member.displayName} on ${CurrentTime}`)
                }} 
            }
        }
        })
    }
//M.kick
if (msg.content.startsWith(config.prefix + "kick")) {
   
    const user = msg.mentions.users.first();
    GuildID.fetchMember(msg.author.id).then (member => {
        if(!member.roles.has(ModRole.id)){
                msg.delete()
                msg.member.send('You do not have permission to use this command.')
                return
            }
        if(member.roles.has(ModRole.id)){
        if (user) {
            if (member) {
                if (user.id = 262477177449086976){
                    msg.author.send("You cannot use this command for the owner.")
                    return
                }
                else {
                member.kick('Optional reason that will display in the audit logs').then(() => {
                console.log(`${msg.author.username} has kicked ${member.displayName} on ${CurrentTime}`);;
            }).catch(err => {
          msg.reply('I was unable to kick the member');
          console.error(err);
        });
      }} else {
        msg.member.send('That user isn\'t in this guild!');
      }
    } else {
      msg.member.send('You didn\'t mention the user to kick!');
    }
  }
});
}    
    //Gatekeeper

    if (msg.content.toLowerCase() == 'agree' && msg.channel.type === 'dm') {

        GuildID.fetchMember(msg.author.id).then (member => {
            if (member.roles.has(MemberRole.id)) return
            if(!member.roles.has(MemberRole.id)){
                if (!msg.content.includes() == 'agree'){
                    msg.author.send("Incorrect! Please Try Again! Remember, it's only ONE word, NOTHING ELSE. If you include other words, **I will not recognize it.**")
                }
                member.addRole(MemberRole)
                msg.author.send(`Congratulations! You are now a member of the server! Enjoy your stay!`)
                msg.author.send({embed: {
                    title: "Your commands as a **__Member__**",
                    description:"My prefix is __!Yo!__",
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL
                    },
                    fields: [{
                        name: "Ping",
                        value:"__**Usage:**!Yo!ping__\nTest the ping",
                      },
                      {
                        name: "Ask Anthabot(Yes/No)",
                        value:"__**Usage:** !Yo!Anthabot, <Any Yes/No>__\nAsk the bot a question. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
                      },
                      {
                        name: "Hello",
                        value: "__**Usage:** !Yo!Hello__\nSay hello to the bot!", 
                      },
                      {
                        name: "How are you?",
                        value: "__**Usage:** !Yo!How are you?__\nAsk the bot how it's feeling. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
                      },
                      {
                        name: "DJ",
                        value: "__**Usage:** !DJ!<DJ command>__\nEnables DJ mode. Use the bot to play music in the VC you are currently in. For DJ help, use !DJ!Help with for a list of commands.",
                      }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: "This bot was proudly made by Anthony Rees and FlyingSixtySix"
                    }
                  }})

                .then(() => {
                    let unverified = edb.unverified
        for (let i = 0; i < unverified.length; i++){
            let id = unverified[i].UserID
            edb.unverified = unverified.filter(entry => entry.UserID != id)
            fs.writeFile('edb.json', JSON.stringify(edb, null, 2), err =>{
                if(err){
                    console.error(err)
                }
            })
            console.log(`${member.id} was removed from the database.`)
        }
                    client.channels.get('404304757558345739').send(`${member.displayName} has been verified and confirmed as a new member! Please welcome them to the server!`)
                    console.log(`${member.displayName} has been verified via DM on ${CurrentTime}`)
                })
            }
        }
    )}


    if (msg.content.toLowerCase() == 'agree' && msg.channel.id === '404305206743007254') {
        if (msg.member.roles.has(MemberRole.id)) return
            if(!msg.member.roles.has(MemberRole.id)){
                if (!msg.content.includes() == 'agree'){
                    msg.member.send("Incorrect! Please Try Again! Remember, it's only ONE word, NOTHING ELSE. If you include other words, **I will not recognize it.**")
                    msg.delete()
                }
        }

        msg.member.addRole(MemberRole)
        msg.delete()
        msg.member.send(`Congratulations! You are now a member of the server! Enjoy your stay!`)
        msg.author.send({embed: {
            title: "Your commands as a **__Member__**",
            description:"My prefix is __!Yo!__",
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            fields: [{
                name: "Ping",
                value:"__**Usage:**!Yo!ping__\nTest the ping",
              },
              {
                name: "Ask Anthabot(Yes/No)",
                value:"__**Usage:** !Yo!Anthabot, <Any Yes/No>__\nAsk the bot a question. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
              },
              {
                name: "Hello",
                value: "__**Usage:** !Yo!Hello__\nSay hello to the bot!", 
              },
              {
                name: "How are you?",
                value: "__**Usage:** !Yo!How are you?__\nAsk the bot how it's feeling. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
              },
              {
                name: "DJ",
                value: "__**Usage:** !DJ!<DJ command>__\nEnables DJ mode. Use the bot to play music in the VC you are currently in. For DJ help, use !DJ!Help with for a list of commands.",
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "This bot was proudly made by Anthony Rees and FlyingSixtySix"
            }
          }})
        .then(() => {
            let unverified = edb.unverified
        for (let i = 0; i < unverified.length; i++){
            let id = unverified[i].UserID
            edb.unverified = unverified.filter(entry => entry.UserID != id)
            fs.writeFile('edb.json', JSON.stringify(edb, null, 2), err =>{
                if(err){
                    console.error(err)
                }
            })
            console.log(`${msg.member.id} was removed from the database.`)
        }
            msg.guild.channels.get('404304757558345739').send(`${msg.member.displayName} has been verified and confirmed as a new member! Please welcome them to the server!`)
            console.log(`${msg.member.displayName} has been verified via Guild Channel on ${CurrentTime}`)
        })}})