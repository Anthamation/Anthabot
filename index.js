const Discord = require('discord.js')
const bot = new Discord.Client()

const utils = require('./utils')
const log = utils.Logger
const commands = utils.getCommands()

const config = require('./config.json')

bot.on('ready', () => {
  log.info('Ready')
  const now = new Date()
  bot.user.setActivity(`Ready @ ${now.getUTCHours()}:${now.getUTCMinutes()} UTC`)
})

bot.on('message', message => {
  // Ignore messages from bots
  if (message.author.bot) {
    return
  }
  const args = message.content.split(' ')
  const name = message.author.username
  let prefix
  config.prefixes.forEach(p => {
    p = p.toLowerCase()
    if (message.content.toLowerCase().startsWith(p)) {
      prefix = p
    }
  })
  if (prefix) {
    let command = args[0].toLowerCase().replace(prefix, '')
    if (command === '') {
      command = 'speak'
    }
    let match
    for (let cmd in commands) {
      if (args[1]) {
        if (commands[cmd].info.aliases.indexOf(args[1]) !== -1) {
          match = commands[cmd]
          break
        } else if (commands[cmd].info.aliases.indexOf(command) !== -1) {
          match = commands[cmd]
        }
      } else if (commands[cmd].info.aliases.indexOf(command) !== -1) {
        match = commands[cmd]
      }
    }
    if (!match) {
      return
    }
    if (match.info.deleteCaller) {
      message.delete()
    }
    let extras = {
      'prefix': prefix,
      'command': command,
      'name': name
    }
    if (config.blacklist.users.indexOf(message.author.id) !== -1) {
      return message.channel.send(`${name}, you've been blacklisted from using Anthabot.`)
    }
    log.info(`${name} has executed command ${command}`)
    match.execute(bot, message, args, extras)
  }
})

bot.login(config.token)

process.on('SIGINT', () => {
  bot.destroy()
  log.info('Stopping...')
  utils.logStream.end()
  process.exit(0)
})
