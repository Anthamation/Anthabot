const Discord = require("discord.js");
const client = new Discord.Client();
const JsonDB = require('node-json-db');
const db = new JsonDB("edb", true, true);
const edb = require("./edb.json");
const jwdb = new JsonDB("wdb", true, true);
const bddb = require("./bddb.json")
const jbddb = new JsonDB("bddb", true, true);
const wdb = require("./wdb.json");
const ytm = require('discord.js-musicbot-addon');
const config = require("./config.json");
const YN_list = require("./YN_List.json");
const hruf_List = require("./HRUF.json");
const onearg = require('./choose/1.json')
const twoarg = require('./choose/2.json')
const threearg = require('./choose/3.json')
const fs = require('fs');


client.login(config.token)

client.on('ready', () => {
    ytm.start(client, {
        youtubeKey: config.api,
        prefix: "!DJ!",
        clearOnLeave: true,
        leaveAlt: ["quit"],
        helpCmd: "helpwith",
    })
    console.log(`Anthabot 1.1.15 STABLE successfully connected. Awaiting Commands.`)
    //unverifiedCheck
    var unverifiedCheck = setInterval(uvcTimer, 1000)
    function uvcTimer(){
        fs.readFile("edb.json", "UTF-8", (error, data) => {
            if (error) {
                console.error(error)
            }
            var pdata = JSON.parse(data)
            var unverified = pdata.unverified;
            for (var key in unverified) {
                if (unverified.hasOwnProperty(key)) {
                    let id = unverified[key].UserID
                    var GuildID = client.guilds.get('404304756845051905')
                    let time = unverified[key].UserEX
                    let MemberRole = GuildID.roles.get('404333218922233858')
                    if (time <= new Date().getTime()) {
                        var ddp = "/unverified/ID"
                        var nddp = ddp.replace('ID', key)
                        GuildID.fetchMember(key).then(member => {
                            member.kick("You have failed to verify yourself. If you wish to try again, please find another invite.")
                            console.log(`${member.displayName} failed to verify. Kicking...`)
                        })
                        db.delete(nddp)
                    }
                }if(!unverified.hasOwnProperty(key)){
                    return
                }
            }
        })
    }

    //warningTime Check
    var WarningTimeCheck = setInterval(wtcTimer, 1000)
    function wtcTimer(){
        fs.readFile("wdb.json", "UTF-8", (error, data) => {
            if (error) {
                console.error(error)
            }
            var pdata = JSON.parse(data)
            var warned = pdata.warned;
            for (var key in warned) {
                if (warned.hasOwnProperty(key)) {
                    let time = warned[key].UserEX;
                    let count = warned[key].UserCt;
                    if (time <= new Date().getTime()) {
                        var GuildID = client.guilds.get('404304756845051905')
                        GuildID.fetchMember(key).then(member => {
                            var ddp = "/warned/ID"
                            var nddp = ddp.replace('ID', member.id)
                            member.send("For your good behavior over time, you have been removed from the Warning database.")
                            console.log(`${member.displayName} has been removed from the Warning Database for Good behavior over time.`)
                            jwdb.delete(nddp)
                        })
                        
                    }
                    if(count > 2){
                        var GuildID = client.guilds.get('404304756845051905')
                            GuildID.fetchMember(key).then(member => {
                                member.send("You have exceeded your 3 warnings and you have been banned from the server.").then(() => {
                                    member.ban()
                                    console.log(`${member.displayName} has been removed from the Warning Database for Bad behavior.`)
                                })
                            })
                            var ddp = "/warned/ID"
                            var nddp = ddp.replace('ID', key)
                            jwdb.delete(nddp)
                    }
                }
                if (!warned.hasOwnProperty(key)){
                    return
                }
            }
        })
    }
    //Birthday Check
    var BirthdayCheck = setInterval(bdtimer,86400000)
    function bdtimer(){
        fs.readFile("bddb.json", "UTF-8", (error, data) => {
            if (error) {
                console.error(error)
            }
            var bdata = JSON.parse(data)
            var Birthdays = bdata.Birthdays;
            let currentMonth = new Date().getMonth();
            let currentDay = new Date().getDate();
            for (var key in Birthdays){
                if(Birthdays.hasOwnProperty(key)){
                    let birthmonth = Number(Birthdays[key].formattedMonth);
                    let birthDAY = Number(Birthdays[key].day);
                    if(birthmonth == currentMonth && (birthDAY == currentDay)){
                        var GuildID = client.guilds.get('404304756845051905')
                        var announceChannelID = client.channels.get('405739200176979968')
                        let monthconfirm = Object.keys(Birthdays).filter(function(key){
                            return Birthdays[key].formattedMonth === currentMonth
                        })
                        let dayconfirm = Object.keys(Birthdays).filter(function(key){
                            return Birthdays[key].day === currentDay
                        })
                        
                        var bdayarrays = [monthconfirm,dayconfirm]
            
                        var match = bdayarrays.shift().filter(function(v){
                            return bdayarrays.every(function(a) {
                                return a.indexOf(v) !== -1;
                            })
                        })
                        var bdayuser = match.toString();
                        GuildID.fetchMember(bdayuser).then(member => {
                            member.send(`Happy Birthday, ${member.displayName}!-From Anthony, Anthabot, and the members of Anthony's Server of Servitude, we hope you have a good one!`, {
                                file: "https://media.giphy.com/media/37bUqIiNCTt28/giphy.gif"
                            })
                            announceChannelID.send(`@everyone Today is ${member.displayName}'s birthday! Please wish them a happy birthday!`, {
                                file: "https://media.giphy.com/media/37bUqIiNCTt28/giphy.gif"
                            })
                            
                        })
                    }
                    if(!birthmonth == currentMonth && birthDAY == currentDay){
                        return
                    }
                } 
            }
            if(!Birthdays.hasOwnProperty(key)){
                return
            }
        })
  } 
});

/*things to work on: Imagery, announcement, rewrite commands with args and requirement of member status*/

client.on('guildMemberAdd', member => {
    //unverified
    var CurrentTime = new Date();
    var cms = CurrentTime.getTime();
    var UserID = member.id;
    var UserEX = cms + 2592000000;
    var uis = { UserEX };
    var datapath = "/unverified/User";
    var ndp = datapath.replace('User', UserID)
    db.push(ndp, uis);
    db.reload();
    member.send(`Welcome to the Server, ${member.displayName}!\nI'm Antha-Bot, nice to meet you!\nBefore we can get down to business, you need to verify yourself by reading the rules and find the magic keyword that grants you member access!\nWhen you find the keyword, you can enter it in the #rules-and-Access channel OR reply here, and you will be granted access automatically!\nDo it quick! You have 3 days until you are kicked from the server!\n**It's only one word with NO QUOTATIONS.**"`);
    console.log(`${member.displayName} has joined the server at ${member.joinedAt}`)
});



client.on('guildMemberRemove', member => {
    const CurrentTime = new Date();
    console.log(`${member.displayName} has left the server at ${CurrentTime}`)
    function unverifiedRemoval(){
        fs.readFile("edb.json", "UTF-8", (error, data) => {
            if (error) {
                console.error(error)
            }
            var pdata = JSON.parse(data)
            var unverified = pdata.unverified;
            for (var key in unverified) {
                if (unverified.hasOwnProperty(key)) {
                    let id = unverified[key].UserID
                    var GuildID = client.guilds.get('404304756845051905')
                    let time = unverified[key].UserEX
                    let MemberRole = GuildID.roles.get('404333218922233858')
                    if (member.id = id) {
                        var ddp = "/unverified/ID"
                        var nddp = ddp.replace('ID', member.id)
                        db.delete(nddp)
                        console.log(`${member.id} has been removed from the Unverified Database`)
                    }
                }if(!unverified.hasOwnProperty(key)){
                    return
                }
            }
        })
    }
    function warningRemoval(){
        fs.readFile("wdb.json", "UTF-8", (error, data) => {
            if (error) {
                console.error(error)
            }
            var pdata = JSON.parse(data)
            var warned = pdata.warned;
            for (var key in warned) {
                if (warned.hasOwnProperty(key)) {
                    var GuildID = client.guilds.get('404304756845051905')
                    let time = warned[key].UserEX
                    let MemberRole = GuildID.roles.get('404333218922233858')
                    if (member.id = key) {
                        var ddp = "/warned/ID"
                        var nddp = ddp.replace('ID', key)
                        jwdb.delete(nddp)
                        console.log(`${member.id} has been removed from the Warning Database`)
                    }
                }if(!warned.hasOwnProperty(key)){
                    return
                }
            }
        })
    }
    function bdayremoval(){
        fs.readFile("bddb.json", "UTF-8", (error, data) => {
            if (error) {
                console.error(error)
            }
            var bdata = JSON.parse(data)
            var Birthdays = bdata.Birthdays;
            for (var key in Birthdays){
                if(Birthdays.hasOwnProperty(key)){
                    let birthmonth = Birthdays[key].formattedMonth;
                    let birthDAY = Birthdays[key].day;
                    if(member.id = key){
                        var ddp = "/Birthdays/ID"
                        var nddp = ddp.replace('ID', key)
                        jbddb.delete(nddp)
                        console.log(`${member.id} has been removed from the Birthday Database`)
                    }
                }
            }
        })
  }
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
    //Check if the user has at least Member role.
    
        

            
    //Link obliterator
    if (msg.content.includes("https://discord.gg/")) {
        msg.delete()
        msg.member.send('You are reminded that outside Discord server links are not permitted in the server.')
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            console.log(`${member.displayName} has had it's Discord link obliterated on ${CurrentTime}`)
        })
    }
    //User-initiated commands
    //PING
    if (msg.content.startsWith(config.prefix + "ping")) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            msg.reply('Pong!');
            console.log(`${member.displayName} has used the PING command on ${CurrentTime}`)
        })
    }
    //choose function
    if (msg.content.startsWith(config.prefix + "Choose")){
        const args = msg.content.slice(config.prefix.length).slice("Choose".length).trim().replace("?","").split(/(?:,| |or)+/)
        if(args === []){
            msg.reply("There was nothing to choose from!")
            return
        }
        else{
            var elem1;
            var elem2;
            var elem3;
            var random = args.length
            elem1 = args[Math.floor(Math.random() * random)];
if (random > 1) {
    do{
elem2 = args[Math.floor(Math.random() * random)]
    }
    while(elem1 == elem2);
}
if (random >= 3) {
    do{
        elem2 = args[Math.floor(Math.random() * random)]
    }
    while(elem1 == elem2);
    do{
        elem3 = args[Math.floor(Math.random() * random)]
    }
    while(elem2 == elem3)
    do{
        elem3 = args[Math.floor(Math.random() * random)]
    }
    while(elem1 == elem3)
}
if(random >= 3){
    var tpl = threearg.choose[Math.floor(Math.random() * 16)]
}
if(random == 2){
    var tpl = twoarg.choose[Math.floor(Math.random() * 10)]
}
if(random == 1){
    var tpl = onearg.choose[Math.floor(Math.random() * 5)]
}
var res = eval('`'+tpl+'`')
msg.reply(res);
console.log(`${msg.author} used the CHOOSE Function`)
        }
    }
    //Yes/No Function
    if (msg.content.startsWith(config.prefix + "Anthabot,")) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            msg.reply(YN_list.YN_options[Math.floor(Math.random() * 51)])
            console.log(`${member.displayName} has used the Y/N command on ${CurrentTime}`)
        })
    }
    //is your mom gay?
    if (msg.content.startsWith(config.prefix + "is your mom gay?")) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            msg.reply("no u")
            console.log(`${member.displayName} has used the ISYOURMOMGAY command on ${CurrentTime}`)
        })
    }
    //Hello function
    if (msg.content.startsWith(config.prefix + "Hello!")) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            msg.reply("Hi there!")
            console.log(`${member.displayName} has used the Hello! command on ${CurrentTime}`)
        })
    }
    //are you a bitch function by Cameron K.
    if (msg.content.startsWith(config.prefix + "Are you a bitch?")){
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            msg.reply("404 Witty_response.json not found")
            console.log(`${member.displayName} has used the "Are you a bitch" command on ${CurrentTime}`)
        })
    }
    //how are you function
    if (msg.content.startsWith(config.prefix + 'How are you?')) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            msg.reply(hruf_List.HRUFList[Math.floor(Math.random() * 10)])
            console.log(`${member.displayName} has used the HAY command on ${CurrentTime}`)
        })
    }
    //birthday function
    if(msg.content.startsWith(config.prefix + 'BDAY')){
        const args = msg.content.slice(config.prefix.length).slice("BDAY".length).trim().split("/");
        var name = msg.author.tag
        var id = msg.author.id
        let month = Number(args[0]);
        let day = Number(args[1]);
        var UserTag = {};
        var bmonth = {};
        var bday = {};
        if(isNaN(month || day)){
            msg.delete();
            msg.author.send("The format entered is not readable. The correct format is ``<Month Number 1-12>/<Day Number 1-31>``")
            console.log(`BDAY:${msg.author.tag} entered an incorrect format. (Error A)`)
            return
        }
        if(!isNaN(month || day)){
            if(month.length || day.length > 2){
                msg.delete();
                msg.author.send("The format entered is not readable. The correct format is ``<Month Number 1-12>/<Day Number 1-31>``")
                console.log(`BDAY:${msg.author.tag} entered an incorrect format. (Error B)`)
                return
            }
            else {
                if(month > 12){
                    msg.delete();
                    msg.author.send("Months range from 1 to 12. Please try again.")
                    console.log(`BDAY:${msg.author.tag} entered an incorrect format. (Error C)`)
                    return
                }
                if(day > 31){
                    msg.delete();
                    msg.author.send("Days range from 1 to 31. Please try again.")
                    console.log(`BDAY:${msg.author.tag} entered an incorrect format. (Error D)`)
                    return
                }
                else {
                    fs.readFile("bddb.json", "UTF-8", (error, data) => {
                        if (error) {
                            console.error(error)
                        }
                        var rdata = JSON.parse(data)
                        var Birthdays = rdata.Birthdays;
                        
                        for (var key in Birthdays){
                            if (Birthdays.hasOwnProperty(key)){
                                let tag = Birthdays[key].UserTag;
                                let months = Birthdays[key].bmonth;
                                let days = Birthdays[key].bday;
                                if(Birthdays.hasOwnProperty(id)){
                                    let months = Birthdays[key].bmonth;
                                    let days = Birthdays[key].bday;
                                    UserTag = name;
                                    bmonth = month;
                                    bday = day;
                                    let formattedMonth = month - 1
                                    var datapath = "/Birthdays/User"
                                    var ndp = datapath.replace('User', id)
                                    let bdayData = {name, formattedMonth, day}
                                    jbddb.push(ndp,bdayData)
                                    jbddb.reload();
                                    msg.delete();
                                    msg.author.send(`Birthday updated! Birthday set on ${month}/${day}!`)
                                    console.log(`BDAY:${msg.author.tag} has updated their birthday for ${month}/${day}`)
                                }
                                if(!Birthdays.hasOwnProperty(id)){
                                    let formattedMonth = month - 1
                                    let bdayData = {name, formattedMonth, day}
                                    var datapath = "/Birthdays/User";
                                    var ndp = datapath.replace('User', id)
                                    jbddb.push(ndp, bdayData);
                                    jbddb.reload();
                                    msg.delete();
                                    msg.author.send(`Birthday confirmed! Birthday set on ${month}/${day}!`)
                                    console.log(`BDAY:${msg.author.tag} has confirmed their birthday for ${month}/${day}`)
                                }
                            }
                        }
                        if(!Birthdays.hasOwnProperty(key)){
                            let formattedMonth = month - 1
                            let bdayData = {name, formattedMonth, day}
                            var datapath = "/Birthdays/User";
                            var ndp = datapath.replace('User', id)
                            jbddb.push(ndp,bdayData);
                            jbddb.reload();
                            msg.delete();
                            msg.author.send(`Birthday confirmed! Birthday set on ${month}/${day}!`)
                            console.log(`BDAY:${msg.author.tag} has confirmed their birthday for ${month}/${day}`)
                        }
                    })

                }
            }
            
            
        }
    }
     //DJ function/controls
    if (msg.content.startsWith('!DJ!skip')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.')
            }
        })
    }
    if (msg.content.startsWith('!DJ!pause')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.')
            }
        })
    }

    if (msg.content.startsWith('!DJ!resume')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.'
                )
            }
        })
    }
    if (msg.content.startsWith('!DJ!volume')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.'
                )
            }
        })
    }
    if (msg.content.startsWith('!DJ!leave')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.'
                )
            }
        })
    }
    if (msg.content.startsWith('!DJ!join')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.'
                )
            }
        })
    }
    if (msg.content.startsWith('!DJ!volume')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.'
                )
            }
        })
    }
    if (msg.content.startsWith('!DJ!clearqueue')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AdminRole.id)) return
            if (!member.roles.has(AdminRole.id)) {
                msg.reply('You do not have permission to use this command.'
                )
            }
        })
    }
    //DJ Help
    if (msg.content.startsWith('!DJ!Help')) {
        GuildID.fetchMember(msg.author.id).then(member => {
            member.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: "**DJ Mode Commands**",
                    description: "**IMPORTANT!** DJ mode uses !DJ! as the prefix.",
                    fields: [
                        {
                            name: "Detailed command help",
                            value: "__**Usage:**!DJ!help with <command>__\nSpecific help with a certain command"
                        },
                        {
                            name: "Play",
                            value: "__**Usage:**!DJ!play <url> | <search>__\nPlay audio from YouTube"

                        },
                        {
                            name: "Skip",
                            value: "__**Usage:**!DJ!skip [number]__\nSkip a song or multi songs with skip [some number]. Only Admins can use this command"

                        },
                        {
                            name: "Queue",
                            value: "__**Usage:**!DJ!queue [index]__\nDisplay the current queue or an item from the queue."

                        },
                        {
                            name: "Pause",
                            value: "__**Usage:**!DJ!pause__\nPause music playback. Only admins can use this command."

                        },
                        {
                            name: "Resume",
                            value: "__**Usage:**!DJ!resume__\nResumes music playback. Only admins can use this command"

                        },
                        {
                            name: "Volume",
                            value: "__**Usage:**!DJ!volume <number>__\nAdjust the playback volume between 1 and 200. Only admins can use this command."

                        },
                        {
                            name: "Join",
                            value: "__**Usage:**!DJ!join__\nJoins your currently connected channel. Only Admins can use this command"

                        },
                        {
                            name: "Leave",
                            value: "__**Usage:**!DJ!leave__\nLeaves your currently connected channel. Only Admins can use this command."
                        },
                        {
                            name: "Clear Queue",
                            value: "__**Usage:**!DJ!clearqueue__\nClears the song queue. Only Admins can use this command."
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: "The DJ function uses the discord.js-musicbot-addon(https://www.npmjs.com/package/discord.js-musicbot-addon) made by DarkoPendragon."
                    }
                }
            })
        })
    }
            
    if (msg.content.startsWith(config.prefix + "ID")){
            fs.readFile("bddb.json", "UTF-8", (error, data) => {
                if(error){
                    console.log(error)
                }
                var bdata = JSON.parse(data)
                var Birthdays = bdata.Birthdays;
                for (var key in Birthdays){
                    if(Birthdays.hasOwnProperty(key)){
                        if(Birthdays.hasOwnProperty(msg.author.id)){
                            var birthmonth = Birthdays[msg.author.id].formattedMonth;
                            var birthDAY = Birthdays[msg.author.id].day;
                            var reformattedmonth = Number(birthmonth) + 1;
                            var infostr = "month/day"
                            var BDAYstr = infostr.replace("month",reformattedmonth).replace("day",birthDAY)
                        }
                        if(!Birthdays.hasOwnProperty(msg.author.id)){
                            BDAYstr = "No Data"
                        }
                    }
                }
                if(!Birthdays.hasOwnProperty(key)){
                    let BDAYstr = "No Data"
                }
                fs.readFile("wdb.json", "UTF-8", (error, data) => {
                    if(error){
                        console.error(error)
                    }
                    var pdata = JSON.parse(data)
                    var warned = pdata.warned;
                    for (var key in warned){
                        if(warned.hasOwnProperty(key)){
                            if(warned.hasOwnProperty(msg.author.id)){
                                var count = warned[msg.author.id].UserCt;
                                let infostr = "0"
                            var countstr = infostr.replace("0",count)
                            }
                            if(!warned.hasOwnProperty(msg.author.id)){
                                var countstr = 0
                            }
                        }
                    }
                    if(!warned.hasOwnProperty(key)){
                        var countstr = 0
                    }
                    GuildID.fetchMember(msg.author.id).then(member => {
                        const embed = new Discord.RichEmbed({
                            thumbnail: {
                              url: msg.author.avatarURL
                            },
                            title: msg.author.tag,
                            color: 4886754,
                            author: {
                              name: "Anthony's Server of Servitude ID CARD"
                            },
                            fields: [
                              {
                                name: "USER ID",
                                value: "```" + member.id + "```",
                                inline: true
                              },
                              {
                                name: "JOINED ON",
                                value: "```" + member.joinedAt.toDateString() + "```",
                                inline: true
                              },
                              {
                                name: "RANK",
                                value: "```" + member.highestRole.name + "```"
                              }
                              ,
                              {
                                  name: "BIRTHDAY",
                                  value: "```" + BDAYstr + "```",
                                  inline: true
                              },
                              {
                                  name: "WARNING COUNT",
                                  value: "```" + countstr + "```",
                                  inline: true
                              }
                            ]
                          })
                          member.send(embed)
                          console.log(`${member.displayName} used the ID Function`)
                    })
                })
        })
    }
    //help function
    if (msg.content.startsWith(config.prefix + 'Help')) {
        var GuildID = client.guilds.get('404304756845051905')
        GuildID.fetchMember(msg.author.id).then(member => {
            if (!member.roles.has(MemberRole.id)) {
                member.send("You have not been verified yet, so there are no commands available for you.")
            }
            if (member.roles.has(MemberRole.id)) {
                console.log(`${member.displayName} has used the HELP function`)
                member.send({
                    embed: {
                        title: "Your commands as a **__Member__**",
                        description: "My prefix is __!Yo!__",
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        fields: [{
                            name: "Ping",
                            value: "__**Usage:**!Yo!ping__\nTest the ping",
                        },
                        {
                            name: "ID",
                            value: "__**Usage:** !Yo!ID__\nView your personal ID card."
                        },
                        {
                            name:"Choose",
                            value: "__**Usage:** !Yo!Choose <Example1>, <Example2>, or <Example3>?__\nUse the bot to decide from a pool of options you provide. The options are seperated from spaces, commas and \"or\". This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel"
                        },
                        {
                            name: "Ask Anthabot(Yes/No)",
                            value: "__**Usage:** !Yo!Anthabot, <Any Yes/No>__\nAsk the bot a question. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
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
                            name: "Birthday",
                            value: "__**Usage:** !Yo!Birthday <Input your month number: 1-12>/<Input your day number: 1-31>__\nTell the bot when your birthday is and have it announced."
                        },
                        {
                            name: "DJ",
                            value: "__**Usage:** !DJ!<DJ command>__\nEnables DJ mode. Use the bot to play music in the VC you are currently in. For DJ help, use !DJ!Help with for a list of commands.",
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: "```Current Version: 1.1.15```This bot was proudly made by Anthony Rees and FlyingSixtySix"
                        }
                    }
                });
            }
            if (member.roles.has(ModRole.id)) {
                member.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: "Your commands as a **__Moderator__**",
                        description: "My prefix is __!Yo!__",
                        fields: [
                            {
                                name: "Warn",
                                value: "__**Usage:** !Yo!Warn <Mentioned Member>__\nGive a warning to a member acting up. Max cap is 3 until kicked.",
                            },
                            {
                                name: "Kick",
                                value: "__**Usage:** !Yo!Kick <Mentioned Member>__\nGive that member the boot. __**Use this command with responsibily.**__",
                            },
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: "```Current Version: 1.1.15```This bot was proudly made by Anthony Rees and FlyingSixtySix"
                        }
                    }
                });
            }
            if (member.roles.has(AdminRole.id)) {
                member.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: "Your commands as an **__Admin__**",
                        description: "My prefix is __!Yo!__",
                        fields: [
                            {
                                name: "Ban",
                                value: "__**Usage:** !Yo!Ban <Mentioned Member>__\nBan this member forever. ***__Use this command with EVEN MORE responsibily.__***",
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: "```Current Version: 1.1.15```This bot was proudly made by Anthony Rees and FlyingSixtySix"
                        }
                    }
                });
            }
            if (member.roles.has(AnthRole.id)) {
                member.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: "Your commands as **__Anthony__**",
                        description: "My prefix is __!Yo!__",
                        fields: [
                            {
                                name: "Update",
                                value: "__**Usage:** !Yo!Update <List new updatesd>__\nThe bot will announce new updates and features.",
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: "```Current Version: 1.1.15```This bot was proudly made by Anthony Rees and FlyingSixtySix"
                        }
                    }
                });
            }
        })
    }
   
    //anthony's commands
    if (msg.content.startsWith(config.prefix + "Update")){
        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(AnthRole)){
                const args = msg.content.slice(config.prefix.length).slice("Update".length).trim();
                let announce = args[0]
                if(announce.length = 0){
                    console.log("Announcement not found")
                    msg.delete()
                    msg.author.send("No announcement was found.")
                    return
                }
                else{
                    console.log(`Update posted on ${CurrentTime}`)
                    msg.delete();
                    msg.channel.send("@everyone "+announce);
                }
            }
            if(!member.roles.has(AnthRole)){
                msg.delete()
                msg.author.send("You do not have permission to use this command. Verify yourself via DM or in the #rules-and-access channel.")
                return
            }
        })
    }
    //Admin Commands
    //A.Warn
    if (msg.content.startsWith(config.prefix + "Warn")) {
        var mentioned = msg.mentions.members.first();
        if (!mentioned) {
            msg.delete()
            return (msg.author.send('A member was not mentioned.'))
        }
        GuildID.fetchMember(msg.author.id).then
        if (!msg.member.roles.has(AdminRole.id)) {
            msg.delete()
            msg.author.send('You do not have permission to use this command.')
            return
        }
        if (mentioned.id === '262477177449086976') {
            msg.delete()
            return msg.author.send('You cannot warn the owner.')
        }
        if ((msg.member.roles.has(ModRole.id))&&(!msg.member.roles.has(AdminRole.id))) {
            console.log("returned!")
            return
        }
        if(msg.member.roles.has(ModRole.id || AdminRole.id)){
            var cms = CurrentTime.getTime();
            var ext = cms + 2592000000;
            var UserId = {}
            var UserEX = {}
            var UserCt = {}
            UserId = mentioned.id;
            var datapath = "/warned/User";
            var ndp = datapath.replace('User', UserId)
            fs.readFile("wdb.json", "UTF-8", (error, data) => {
                if (error) {
                    console.error(error)
                }
                var pdata = JSON.parse(data)
                var warned = pdata.warned;
                for (var key in warned) {
                    if (warned.hasOwnProperty(key)) {
                        let cnt = warned[key].UserCt;
                        let idd = warned[key]
                        let time = warned[key].UserEX
                        if (warned.hasOwnProperty(UserId)) {
                            let cnt = warned[key].UserCt;
                            let time = warned[key].UserEX;
                            UserEX = ext + 2592000000
                            UserCt = ++cnt
                            var uis = { UserEX, UserCt }
                            jwdb.push(ndp, uis)
                            mentioned.send(`__**WARNING!**__\nYour actions have been noted once again by an Admin or Moderator with a total of ${UserCt} warnings and your cooldown timer has been reset to 30 days from now.\n__**REMINDER!**__\nIf you exceed 3 warnings, YOU WILL BE BANNED.`)
                            msg.author.send(`Successfully warned ${mentioned.displayName}`);
                            console.log(`${msg.author.username} successfully warned ${mentioned.displayName}`)
                        }
                        if (!warned.hasOwnProperty(UserId)) {
                            UserCt = 1
                            var uis = { UserEX, UserCt }
                            jwdb.push(ndp, uis)
                            mentioned.send(`__**WARNING!**__\nYour actions have been noted by an Admin or Moderator with a total of ${UserCt} warning and your cooldown timer has been set to 30 days from now. To be removed from the warning database, do not break any more rules and your cooldown timer will expire, automatically removing you from the database. However, breaking rules before the cooldown timer expires will only reset the timer and add another warning to the database. If you exceed 3 warnings, YOU WILL BE BANNED.`)
                            msg.author.send(`Successfully warned ${mentioned.displayName}`);
                            console.log(`${msg.author.username} successfully warned ${mentioned.displayName}`)
                        }
                        
                        if (time <= new Date().getTime()) {
                            var ddp = "/warned/ID"
                            var nddp = ddp.replace('ID', key)
                            GuildID.fetchMember(key).then(member => {
                                member.send("For your good behavior over time, you have been removed from the Warning database.")
                                console.log(`${member.displayName} has been removed from the Warning Database for Good behavior over time.`)
                            })
                            jwdb.delete(nddp)
                        }
    
                    }
                }
                if (!warned.hasOwnProperty(key)) {
                    UserEX = ext
                    UserCt = 1
                    var uis = { UserEX, UserCt }
                    jwdb.push(ndp, uis)
                    msg.author.send(`Successfully warned ${mentioned.displayName}`);
                    console.log(`${msg.author.username} successfully warned ${mentioned.displayName}`)
                }
            })
        }
        

    }
    //A.kick  
    if (msg.content.startsWith(config.prefix + 'Kick')) {
        let mentioned = msg.mentions.members.first()
        if (!mentioned) {
            msg.delete()
            return msg.author.send('A member was not mentioned.')
        }
        if (!msg.member.roles.has(AdminRole.id)) {
            msg.delete()
            return msg.author.send('You do not have permission to use this command.')
        }
        if (mentioned.id === '262477177449086976') {
            msg.delete()
            return msg.author.send('You cannot kick the owner.')
        }
        mentioned.kick('You have been kicked by an Admin').then(() => {
            console.log(`${msg.member.user.tag} has kicked ${mentioned.user.tag} on ${CurrentTime}.`)
            return msg.author.send('User kicked.')
        }, err => {
            console.log('Failed to kick a member:')
            console.error(err)
            return msg.author.send('Failed to kick user.')
        })
    }

    //A.Ban    
    if (msg.content.startsWith(config.prefix + 'Ban')) {
        let mentioned = msg.mentions.members.first()
        if (!mentioned) {
            msg.delete()
            return msg.author.send('A member was not mentioned.')
        }
        if (!msg.member.roles.has(AdminRole.id)) {
            msg.delete()
            return msg.author.send('You do not have permission to use this command.')
        }
        if (mentioned.id === '262477177449086976') {
            msg.delete()
            return msg.author.send('You cannot ban the owner.')
        }
        mentioned.ban('You have been banned by an Admin').then(() => {
            console.log(`${msg.member.user.tag} has banned ${mentioned.user.tag} on ${CurrentTime}.`)
            return msg.author.send('User banned.')
        }, err => {
            console.log('Failed to ban a member:')
            console.error(err)
            return msg.author.send('Failed to kick user.')
        })
    }
    //Moderator commands
    //M.Warn
    if (msg.content.startsWith(config.prefix + "Warn")) {
        var mentioned = msg.mentions.members.first();
        if (!mentioned) {
            msg.delete()
            return (msg.author.send('A member was not mentioned.'))
        }
        GuildID.fetchMember(msg.author.id).then
        if (!msg.member.roles.has(ModRole.id)) {
            msg.delete()
            msg.author.send('You do not have permission to use this command.')
            return
        }
        if (mentioned.id === '262477177449086976') {
            msg.delete()
            msg.author.send('You cannot warn the owner.')
            return 
        }
        
        if ((msg.member.roles.has(ModRole.id))&&(!msg.member.roles.has(AdminRole.id))){
            var cms = CurrentTime.getTime();
            var ext = cms + 2592000000;
            var UserId = {}
            var UserEX = {}
            var UserCt = {}
            UserId = mentioned.id;
            var datapath = "/warned/User";
            var ndp = datapath.replace('User', UserId)
            fs.readFile("wdb.json", "UTF-8", (error, data) => {
                if (error) {
                    console.error(error)
                }
                var pdata = JSON.parse(data)
                var warned = pdata.warned;
                for (var key in warned) {
                    if (warned.hasOwnProperty(key)) {
                        let cnt = warned[key].UserCt;
                        let idd = warned[key]
                        let time = warned[key].UserEX
                        if (warned.hasOwnProperty(UserId)) {
                            let cnt = warned[key].UserCt;
                            let time = warned[key].UserEX;
                            UserEX = ext + 2592000000
                            UserCt = ++cnt
                            var uis = { UserEX, UserCt }
                            jwdb.push(ndp, uis)
                            mentioned.send(`__**WARNING!**__\nYour actions have been noted once again by an Admin or Moderator with a total of ${UserCt} warnings and your cooldown timer has been reset to 30 days from now.\n__**REMINDER!**__\nIf you exceed 3 warnings, YOU WILL BE BANNED.`)
                            msg.author.send(`Successfully warned ${mentioned.displayName}`);
                            console.log(`${msg.author.username} successfully warned ${mentioned.displayName}`)
                        }
                        if (!warned.hasOwnProperty(UserId)) {
                            UserCt = 1
                            var uis = { UserEX, UserCt }
                            jwdb.push(ndp, uis)
                            mentioned.send(`__**WARNING!**__\nYour actions have been noted by an Admin or Moderator with a total of ${UserCt} warning and your cooldown timer has been set to 30 days from now. To be removed from the warning database, do not break any more rules and your cooldown timer will expire, automatically removing you from the database. However, breaking rules before the cooldown timer expires will only reset the timer and add another warning to the database. If you exceed 3 warnings, YOU WILL BE BANNED.`)
                            msg.author.send(`Successfully warned ${mentioned.displayName}`);
                            console.log(`${msg.author.username} successfully warned ${mentioned.displayName}`)
                        }
                        if (cnt > 2) {
                            var ddp = "/warned/ID"
                            var nddp = ddp.replace('ID', key)
                            jwdb.delete(nddp)
                            GuildID.fetchMember(key).then(member => {
                                member.send("You have exceeded your 3 warnings and you have been banned from the server.")
                                member.ban()
                                console.log(`${member.displayName} has been removed from the Warning Database for Bad behavior.`)
                            })
                        }
                        if (time <= new Date().getTime()) {
                            var ddp = "/warned/ID"
                            var nddp = ddp.replace('ID', key)
                            GuildID.fetchMember(key).then(member => {
                                member.send("For your good behavior over time, you have been removed from the Warning database.")
                                console.log(`${member.displayName} has been removed from the Warning Database for Good behavior over time.`)
                            })
                            jwdb.delete(nddp)
                        }
    
                    }
                }
                if (!warned.hasOwnProperty(key)) {
                    UserEX = ext
                    UserCt = 1
                    var uis = { UserEX, UserCt }
                    jwdb.push(ndp, uis)
                    msg.author.send(`Successfully warned ${mentioned.displayName}`);
                    console.log(`${msg.author.username} successfully warned ${mentioned.displayName}`)
                }
            })
        }
    }
    //M.kick
    if (msg.content.startsWith(config.prefix + 'Kick')) {
        let mentioned = msg.mentions.members.first()
        if (!mentioned) {
            msg.delete()
            return msg.author.send('A member was not mentioned.')
        }
        if (!msg.member.roles.has(ModRole.id)) {
            msg.delete()
            return msg.author.send('You do not have permission to use this command.')
        }
        if (mentioned.id === '262477177449086976') {
            msg.delete()
            return msg.author.send('You cannot kick the owner.')
        }
        mentioned.kick('You have been kicked by a Mod').then(() => {
            console.log(`${msg.member.user.tag} has kicked ${mentioned.user.tag} on ${CurrentTime}.`)
            return msg.author.send('User kicked.')
        }, err => {
            console.log('Failed to kick a member:')
            console.error(err)
            return msg.author.send('Failed to kick user.')
        })
    }
    //Gatekeeper

    if (msg.content.toLowerCase() == 'agree' && msg.channel.type === 'dm') {

        GuildID.fetchMember(msg.author.id).then(member => {
            if (member.roles.has(MemberRole.id)) return
            if (!member.roles.has(MemberRole.id)) {
                if (!msg.content.includes() == 'agree') {
                    msg.author.send("Incorrect! Please Try Again! Remember, it's only ONE word, NOTHING ELSE. If you include other words, **I will not recognize it.**")
                }
                member.addRole(MemberRole).then(member => {
                        var ddp = "/unverified/ID"
                        var nddp = ddp.replace('ID', member.id)
                        db.delete(nddp)
                })            
                msg.author.send(`Congratulations! You are now a member of the server! Enjoy your stay!`)
                fs.readFile("bddb.json", "UTF-8", (error, data) => {
                    if(error){
                        console.log(error)
                    }
                    var bdata = JSON.parse(data)
                    var Birthdays = bdata.Birthdays;
                    for (var key in Birthdays){
                        if(Birthdays.hasOwnProperty(key)){
                            if(Birthdays.hasOwnProperty(msg.author.id)){
                                var birthmonth = Birthdays[msg.author.id].formattedMonth;
                                var birthDAY = Birthdays[msg.author.id].day;
                                var reformattedmonth = Number(birthmonth) + 1;
                                var infostr = "month/day"
                                var BDAYstr = infostr.replace("month",reformattedmonth).replace("day",birthDAY)
                            }
                            if(!Birthdays.hasOwnProperty(msg.author.id)){
                                BDAYstr = "No Data"
                            }
                        }
                    }
                    if(!Birthdays.hasOwnProperty(key)){
                        let BDAYstr = "No Data"
                    }
                    console.log(BDAYstr)
                    fs.readFile("wdb.json", "UTF-8", (error, data) => {
                        if(error){
                            console.error(error)
                        }
                        var pdata = JSON.parse(data)
                        var warned = pdata.warned;
                        for (var key in warned){
                            if(warned.hasOwnProperty(key)){
                                if(warned.hasOwnProperty(msg.author.id)){
                                    var count = warned[msg.author.id].UserCt;
                                    let infostr = "0"
                                var countstr = infostr.replace("0",count)
                                }
                                if(!warned.hasOwnProperty(msg.author.id)){
                                    var countstr = 0
                                }
                            }
                        }
                        if(!warned.hasOwnProperty(key)){
                            var countstr = 0
                        }
                        console.log(countstr)
                        GuildID.fetchMember(msg.author.id).then(member => {
                            const embed = new Discord.RichEmbed({
                                thumbnail: {
                                  url: msg.author.avatarURL
                                },
                                title: msg.author.tag,
                                color: 4886754,
                                author: {
                                  name: "Anthony's Server of Servitude ID CARD"
                                },
                                fields: [
                                  {
                                    name: "USER ID",
                                    value: "```" + member.id + "```",
                                    inline: true
                                  },
                                  {
                                    name: "JOINED ON",
                                    value: "```" + member.joinedAt.toDateString() + "```",
                                    inline: true
                                  },
                                  {
                                    name: "RANK",
                                    value: "```" + member.highestRole.name + "```"
                                  }
                                  ,
                                  {
                                      name: "BIRTHDAY",
                                      value: "```" + BDAYstr + "```",
                                      inline: true
                                  },
                                  {
                                      name: "WARNING COUNT",
                                      value: "```" + countstr + "```",
                                      inline: true
                                  }
                                ]
                              })
                              member.send(embed)
                        })
                    })
            })
                msg.author.send({
                    embed: {
                        title: "Your commands as a **__Member__**",
                        description: "My prefix is __!Yo!__",
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        fields: [{
                            name: "Ping",
                            value: "__**Usage:**!Yo!ping__\nTest the ping",
                        },
                        {
                            name: "Ask Anthabot(Yes/No)",
                            value: "__**Usage:** !Yo!Anthabot, <Any Yes/No>__\nAsk the bot a question. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
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
                            text: "```Current Version: 1.1.15```This bot was proudly made by Anthony Rees and FlyingSixtySix"
                        }
                    }
                })

                client.channels.get('404304757558345739').send(`${member.displayName} has been verified and confirmed as a new member! Please welcome them to the server!`)
                console.log(`${member.displayName} has been verified via DM on ${CurrentTime}`)
                
            }
            
        }
        )
    }


    if (msg.content.toLowerCase() == 'agree' && msg.channel.id === '404305206743007254') {
        if (msg.member.roles.has(MemberRole.id)) return
        if (!msg.member.roles.has(MemberRole.id)) {
            if (!msg.content.includes() == 'agree') {
                msg.member.send("Incorrect! Please Try Again! Remember, it's only ONE word, NOTHING ELSE. If you include other words, **I will not recognize it.**")
                msg.delete()
            }
        }
        msg.member.addRole(MemberRole).then(member => {
            var ddp = "/unverified/ID"
            var nddp = ddp.replace('ID', member.id)
            db.delete(nddp)
    })
        msg.delete()
        msg.member.send(`Congratulations! You are now a member of the server and here is your very own ID card! This let's you know where you stand as far as general info for your membership. Please enjoy your stay.\n If you need help, try !Yo!Help!`)
        fs.readFile("bddb.json", "UTF-8", (error, data) => {
            if(error){
                console.log(error)
            }
            var bdata = JSON.parse(data)
            var Birthdays = bdata.Birthdays;
            for (var key in Birthdays){
                if(Birthdays.hasOwnProperty(key)){
                    if(Birthdays.hasOwnProperty(msg.author.id)){
                        var birthmonth = Birthdays[msg.author.id].formattedMonth;
                        var birthDAY = Birthdays[msg.author.id].day;
                        var reformattedmonth = Number(birthmonth) + 1;
                        var infostr = "month/day"
                        var BDAYstr = infostr.replace("month",reformattedmonth).replace("day",birthDAY)
                    }
                    if(!Birthdays.hasOwnProperty(msg.author.id)){
                        BDAYstr = "No Data"
                    }
                }
            }
            if(!Birthdays.hasOwnProperty(key)){
                let BDAYstr = "No Data"
            }
            console.log(BDAYstr)
            fs.readFile("wdb.json", "UTF-8", (error, data) => {
                if(error){
                    console.error(error)
                }
                var pdata = JSON.parse(data)
                var warned = pdata.warned;
                for (var key in warned){
                    if(warned.hasOwnProperty(key)){
                        if(warned.hasOwnProperty(msg.author.id)){
                            var count = warned[msg.author.id].UserCt;
                            let infostr = "0"
                        var countstr = infostr.replace("0",count)
                        }
                        if(!warned.hasOwnProperty(msg.author.id)){
                            var countstr = 0
                        }
                    }
                }
                if(!warned.hasOwnProperty(key)){
                    var countstr = 0
                }
                console.log(countstr)
                GuildID.fetchMember(msg.author.id).then(member => {
                    const embed = new Discord.RichEmbed({
                        thumbnail: {
                          url: msg.author.avatarURL
                        },
                        title: msg.author.tag,
                        color: 4886754,
                        author: {
                          name: "Anthony's Server of Servitude ID CARD"
                        },
                        fields: [
                          {
                            name: "USER ID",
                            value: "```" + member.id + "```",
                            inline: true
                          },
                          {
                            name: "JOINED ON",
                            value: "```" + member.joinedAt.toDateString() + "```",
                            inline: true
                          },
                          {
                            name: "RANK",
                            value: "```" + member.highestRole.name + "```"
                          }
                          ,
                          {
                              name: "BIRTHDAY",
                              value: "```" + BDAYstr + "```",
                              inline: true
                          },
                          {
                              name: "WARNING COUNT",
                              value: "```" + countstr + "```",
                              inline: true
                          }
                        ]
                      })
                      member.send(embed)
                })
            })
    })
        msg.author.send({
            embed: {
                title: "Your commands as a **__Member__**",
                description: "My prefix is __!Yo!__",
                color: 3447003,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                fields: [{
                    name: "Ping",
                    value: "__**Usage:**!Yo!ping__\nTest the ping",
                },
                {
                    name: "Ask Anthabot(Yes/No)",
                    value: "__**Usage:** !Yo!Anthabot, <Any Yes/No>__\nAsk the bot a question. This command replies from a random phrase from a database. Have a suggestion for a phrase? Suggest in the #suggestions channel",
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
                    text: "```Current Version: 1.1.15```This bot was proudly made by Anthony Rees and FlyingSixtySix"
                }
            }
        })
    }
})