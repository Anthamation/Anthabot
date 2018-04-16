async function execute (bot, message, args, extras) {
  return message.channel.send(`:ping_pong: - **\`${Math.round(bot.ping)}ms\`**`)
}

const info = {
  'name': 'Ping',
  'category': 'Utilities',
  'aliases': ['ping'],
  'usage': 'ping',
  'description': 'Returns the ping from Discord.',
  'requiredPerms': [],
  'deleteCaller': false
}

module.exports = { execute, info }
