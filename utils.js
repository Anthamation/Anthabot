const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const config = require('./config.json')

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
    console.debug(prefix + text)
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

module.exports = { logStream, Logger, getCommands, getYaml }
