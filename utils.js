const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const config = require('./config.json')
const index = require('./')

const now = new Date(config.useUTC ? Date.UTC() : new Date())
const year = now.getFullYear()
const month = now.getMonth().toString().padStart(2, '0')
const day = now.getDate().toString().padStart(2, '0')

const logStream = fs.createWriteStream(path.join(__dirname, `${year}-${month}-${day}.log`), { encoding: 'utf8', flags: 'a' })

class Logger {
  static getLogPrefix (type) {
    const now = new Date(config.useUTC ? Date.UTC() : new Date())
    const year = now.getFullYear()
    const month = now.getMonth().toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    const second = now.getSeconds().toString().padStart(2, '0')
    type = type.toUpperCase()
    return `${year}-${month}-${day} ${hour}:${minute}:${second} ${type} | `
  }
  static info (text) {
    const prefix = this.getLogPrefix('info')
    console.log(prefix + text)
    if (config.log.saveToFile) {
      logStream.write(prefix + text + '\n')
    }
  }
  static warn (text) {
    const prefix = this.getLogPrefix('warn')
    console.warn(prefix + text)
    if (config.log.saveToFile) {
      logStream.write(prefix + text + '\n')
    }
  }
  static error (text) {
    const error = new Error(text)
    const prefix = this.getLogPrefix('error')
    console.log(prefix + 'An error has occurred:\n' + error.stack)
    if (config.log.saveToFile) {
      logStream.write(prefix + 'An error has occurred:\n' + error.stack + '\n')
    }
  }
  static debug (text) {
    const prefix = this.getLogPrefix('debug')
    if (index.debugMode) {
      console.debug(prefix + text)
    }
    if (config.log.saveToFile) {
      logStream.write(prefix + text + '\n')
    }
  }
}

function getCommands (name) {
  let cmds = {}
  if (name) {
    name = name.toLowerCase()
  }
  fs.readdir(path.join(__dirname, 'commands'), (err, files) => {
    if (err) {
      Logger.error(err)
      return cmds
    }
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      file = file.replace(/\.\w+/, '')
      if (name && file !== name) {
        continue
      }
      cmds[file] = require(path.join(__dirname, 'commands', file))
    }
  })
  return cmds
}

function getYaml (relLoc) {
  return yaml.safeLoad(fs.readFileSync(path.join(__dirname, relLoc), 'utf8'))
}

function registerEvents (bot) {
  Logger.debug('Call to registerEvents')
  let events = {}
  fs.readdir(path.join(__dirname, 'events'), (err, files) => {
    if (err) {
      Logger.error(err)
      return events
    }
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      file = file.replace(/\.\w+/, '')
      let event = require(path.join(__dirname, 'events', file))
      Logger.debug(`Listener count for "${event.info.event}": ${bot.listeners(event.info.event).length}`)
      events[file] = event
    }
    Logger.debug(`events: ${JSON.stringify(events)}`)
    Object.keys(events).forEach(event => {
      event = events[event]
      bot.on(event.info.event, event.execute)
      Logger.debug(`Listening to ${event.info.event}`)
    })
  })
}

module.exports = { logStream, Logger, getCommands, getYaml, registerEvents }
