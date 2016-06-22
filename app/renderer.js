'use strict'

const {app} = require('electron').remote.require('electron')
const ospath = require('path')
const fs = require('fs')
const needle = require('needle')

const say = (msg) => {
  document.body.innerHTML += msg + '\n'
}

document.addEventListener('DOMContentLoaded', function () {
  try {
    beEvil()
  } catch (e) {
    say(`uncaught error: ${e.stack || e}`)
  }
})

function beEvil () {
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
  } else {
    say('itch data path protected and/or non-existent')
  }

  const apiKey = process.env.ITCHIO_API_KEY
  if (apiKey) {
    say(`got itch.io api key (${apiKey.length} chars)`)
    needle.get('https://itch.io/api/1/jwt/me', {
      headers: { 'Authorization': apiKey }
    }, function (err, resp) {
      if (err) {
        say(`API error: ${err}`)
      } else if (resp.statusCode === 200 && !resp.body.errors) {
        say(`me: ${JSON.stringify(resp.body, 0, 2)}`)
      } else {
        say(`HTTP ${resp.statusCode}: ${JSON.stringify(resp.body, 0, 2)}`)
      }
    })
  } else {
    say('no API key')
  }

}
