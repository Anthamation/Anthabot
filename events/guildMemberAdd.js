const utils = require('../utils')
const log = utils.Logger
const config = require('../config.json')

async function execute (member) {
  log.info(`${member.user.tag} has joined ${member.guild.name} at ${member.joinedAt}.`)
  let accessChannel = member.guild.channels.get(config.accessChannel)
  if (!accessChannel) {
    accessChannel = '[access channel]'
  }
  let welcomeMessage = config.welcomeMessage
  /* Valid variables are:
   * - {server} --> Server name
   * - {name} --> Username
   * - {accesschannel} --> Channel mention for accessChannel
   */
  welcomeMessage = welcomeMessage.replace(/{server}/gi, member.guild.name)
  welcomeMessage = welcomeMessage.replace(/{name}/gi, member.user.username)
  welcomeMessage = welcomeMessage.replace(/{accesschannel}/gi, accessChannel)
  member.send(welcomeMessage).catch(err => {
    log.error(`Error sending welcome message to ${member.user.tag}`)
    return log.error(err)
  })
}

const info = { 'event': 'guildMemberAdd' }

module.exports = { execute, info }
