const utils = require('../utils')
const lines = utils.getYaml('speak_lines.yml').lines

for (let i = 0; i < lines.length; i++) {
  if (lines[i].charAt(0) !== 'I') {
    lines[i] = lines[i].charAt(0).toLowerCase() + lines[i].slice(1)
  }
}

async function execute (bot, message, args, extras) {
  return message.channel.send(`${extras.name}, ${lines[Math.floor(Math.random() * lines.length)]}`)
}

const info = {
  'name': 'Speak',
  'category': '',
  'aliases': [' ', ',', 'speak'],
  'usage': '[question]',
  'description': 'Responds with one of many premade lines.',
  'requiredPerms': []
}

module.exports = { execute, info }
