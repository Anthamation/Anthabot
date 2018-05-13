const { Permissions } = require('discord.js')

const utils = require('../utils')

async function execute (bot, message, args, extras) {
  let mentioned = message.mentions.members.first()
  if (!mentioned) {
    return message.channel.send(`${extras.name}, you didn't mention a member.`)
  }
  if (message.member.highestRole.comparePositionTo(mentioned.highestRole) <= 0) {
    return message.channel.send(`${extras.name}, you can't kick members whose highest role is greater than or equal to yours.`)
  }
  await mentioned.kick()
  utils.Logger.info(`${mentioned.user.tag} (${mentioned.id}) has been kicked by ${message.author.tag} (${message.author.id})`)
  message.channel.send(`${mentioned.user.tag} has been kicked.`)
}

const info = {
  'name': 'Kick',
  'category': 'Moderation',
  'aliases': ['kick'],
  'usage': 'kick (@member)',
  'description': 'Kicks the mentioned user.',
  'requiredPerms': [Permissions.FLAGS.KICK_MEMBERS],
  'deleteCaller': false
}

module.exports = { execute, info }
