const utils = require('../utils')
const log = utils.Logger

async function execute (member) {
  log.info(`${member.user.tag} has left ${member.guild.name} at ${new Date()}`)
}

const info = { 'event': 'guildMemberRemove' }

module.exports = { execute, info }
