const { Permissions } = require('discord.js')

const utils = require('../utils')

async function execute (bot, message, args, extras) {
  let mentioned = message.mentions.members.first()
  if (!mentioned) {
    return message.channel.send(`${extras.name}, you didn't mention a member.`)
  }
  if ((message.member.highestRole.comparePositionTo(mentioned.highestRole) <= 0) && message.member.id !== message.guild.owner.id) {
    return message.channel.send(`${extras.name}, you can't ban members whose highest role is greater than or equal to yours.`)
  }
  if (message.guild.member(bot.user).highestRole.comparePositionTo(mentioned.highestRole) <= 0) {
    return message.channel.send(`${extras.name}, I can't ban the mentioned member.`)
  }
  let days = args[2] || 1
  if (isNaN(days)) {
    return message.channel.send(`${extras.name}, you've specified an invalid amount of days. (not a number)`)
  }
  days = parseInt(days)
  if (days < 0 || days > 7) {
    return message.channel.send(`${extras.name}, days out of range. (< 0 or > 7)`)
  }
  await mentioned.ban({ days: days, reason: `Banned by ${message.author.tag} (${message.author.id})` }).catch(err => {
    if (err) {
      return utils.Logger.error(err)
    }
  })
  utils.Logger.info(`${mentioned.user.tag} (${mentioned.id}) has been banned by ${message.author.tag} (${message.author.id}), removing ${days} day(s) worth of messages`)
  message.channel.send(`${mentioned.user.tag} has been banned.`)
}

const info = {
  'name': 'Ban',
  'category': 'Moderation',
  'aliases': ['ban'],
  'usage': 'ban (@member) [days]',
  'description': 'Bans the mentioned user, removing the specified amount of days worth of messages (default = 1).',
  'requiredPerms': [Permissions.FLAGS.BAN_MEMBERS],
  'deleteCaller': false
}

module.exports = { execute, info }
