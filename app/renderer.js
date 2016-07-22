'use strict'

const {app} = require('electron').remote.require('electron')
const ospath = require('path')
const fs = require('fs')
const needle = require('needle')
const os = require('os')

const say = (msg) => {
  document.body.innerHTML += msg + '\n'
}

document.addEventListener('DOMContentLoaded', function () {
  try {
    beNaughty()
    beNice()
  } catch (e) {
    say(`uncaught error: ${e.stack || e}`)
  }
})

function beNaughty () {
  const appDataPath = app.getPath('appData')

  say('<h2>Being naughty</h2>')

  for (const itchName of ['itch', 'kitch']) {
    say(`<i>For ${itchName}</i>`)
    const itchPath = ospath.join(appDataPath, itchName)
    if (fs.existsSync(itchPath)) {
      const butlerCredsPath = (os.platform() === 'win32') ? ospath.join(process.env.USERPROFILE, '.config', itchName, 'butler_creds'): ospath.join(itchPath, 'butler_creds')
      try {
        fs.readFileSync(butlerCredsPath)
        say(`<em>stole ${itchName} butler creds</em>`)
      } catch (e) {
        say(`<i>could not steal ${itchName} butler credentials (${e.message})</i>`)
      }

      const usersDir = ospath.join(itchPath, 'users')
      let userIds = []
      try {
        userIds = fs.readdirSync(usersDir)
      } catch (e) {
        say(`<i>could not list ${itchName} users (${e.message})</i>`)
      }

      for (const userId of userIds) {
        if (isNaN(parseInt(userId, 10))) {
          continue
        }

        const tokenPath = ospath.join(usersDir, userId, 'token.json')
        try {
          fs.readFileSync(tokenPath)
          say(`<em>stole token for ${itchName} user #${userId}</em>`)
        } catch (e) {
          say(`<i>could not steal token for ${itchName} user #${userId} (${e.message})</i>`)
        }
      }
    } else {
      say(`<i>${itchName} data path protected and/or non-existent</i>`)
    }
  }

}

function beNice () {
  say('<h2>Being nice</h2>')

  say(`<i>Args: ${require('electron').remote.process.argv.join(', ')}</i>`)

  const apiKey = process.env.ITCHIO_API_KEY
  if (apiKey) {
    say(`<i>Got itch.io API key (${apiKey.length} chars), loading...</i>`)
    needle.get('https://itch.io/api/1/jwt/me', {
      headers: { 'Authorization': apiKey }
    }, function (err, resp) {
      if (err) {
        say(`API error: ${err}`)
      } else if (resp.statusCode === 200 && !resp.body.errors) {
        const {user} = resp.body
        const flags = []
        if (user.press_user) { flags.push('press') }
        if (user.developer) { flags.push('gamedev') }
        const flagString = flags.length ? ` (${flags.join(', ')})` : ''

        say(`<i>Authed as <a href='${user.url}'>${user.display_name || user.username}</a>${flagString}</i>`)
        say(`<img src="${user.cover_url}">`)
      } else {
        say(`HTTP ${resp.statusCode}: ${JSON.stringify(resp.body, 0, 2)}`)
      }
    })
  } else {
    say('<i>no API key</i>')
  }
}
